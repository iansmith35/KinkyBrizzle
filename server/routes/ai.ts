import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import { supabase } from '../config/supabase.js';
import { createPrintfulProduct } from '../services/printful.js';
import { generateImage } from '../services/imageGenerator.js';
import { executeRubeWorkflow } from '../services/rube.js';

const router = Router();

// Initialize both AI providers
const geminiApiKey = process.env.GEMINI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

let geminiAI: GoogleGenAI | null = null;
let openaiClient: OpenAI | null = null;

if (geminiApiKey) {
  geminiAI = new GoogleGenAI({ apiKey: geminiApiKey });
  console.log('✅ Google Gemini AI initialized');
} else {
  console.warn('⚠️ GEMINI_API_KEY not set');
}

if (openaiApiKey) {
  openaiClient = new OpenAI({ apiKey: openaiApiKey });
  console.log('✅ OpenAI initialized');
} else {
  console.warn('⚠️ OPENAI_API_KEY not set');
}

if (!geminiAI && !openaiClient) {
  console.error('❌ No AI provider configured! Set either GEMINI_API_KEY or OPENAI_API_KEY');
}

// Function calling tools for the AI agent
const tools = [
  {
    name: 'get_products',
    description: 'Fetch all products from the database',
    parameters: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'create_product',
    description: 'Create a new product with Printful integration',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Product name' },
        description: { type: 'string', description: 'Product description' },
        price: { type: 'number', description: 'Product price' },
        design_prompt: { type: 'string', description: 'Prompt for AI to generate design' }
      },
      required: ['name', 'description', 'price']
    }
  },
  {
    name: 'generate_design',
    description: 'Generate a design/logo image using AI',
    parameters: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'Description of the design to generate' }
      },
      required: ['prompt']
    }
  },
  {
    name: 'get_orders',
    description: 'Fetch all orders from the database',
    parameters: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'update_order_status',
    description: 'Update the status of an order',
    parameters: {
      type: 'object',
      properties: {
        order_id: { type: 'string', description: 'Order ID' },
        status: { type: 'string', description: 'New status' }
      },
      required: ['order_id', 'status']
    }
  },
  {
    name: 'search_web',
    description: 'Search the web for information',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' }
      },
      required: ['query']
    }
  },
  {
    name: 'execute_workflow',
    description: 'Execute a Rube.app workflow for automation',
    parameters: {
      type: 'object',
      properties: {
        workflow_name: { type: 'string', description: 'Name of the workflow' },
        data: { type: 'object', description: 'Data to pass to workflow' }
      },
      required: ['workflow_name']
    }
  }
];

// Function implementations
async function executeFunction(functionName: string, args: any, sessionId: string) {
  console.log(`Executing function: ${functionName}`, args);
  
  // Log AI action
  await supabase.from('ai_actions').insert({
    session_id: sessionId,
    action_type: functionName,
    action_data: args
  });

  switch (functionName) {
    case 'get_products':
      const { data: products } = await supabase.from('products').select('*');
      return { products };

    case 'create_product':
      try {
        // Generate design if prompt provided
        let imageUrl = 'https://picsum.photos/800/800';
        if (args.design_prompt) {
          imageUrl = await generateImage(args.design_prompt);
        }

        // Create product in Printful
        const printfulProduct = await createPrintfulProduct({
          name: args.name,
          description: args.description,
          designUrl: imageUrl
        });

        // Save to database
        const { data: product } = await supabase
          .from('products')
          .insert({
            name: args.name,
            description: args.description,
            price: args.price,
            image_url: imageUrl,
            printful_product_id: printfulProduct.id,
            sku: `KB-${Date.now()}`
          })
          .select()
          .single();

        return { success: true, product };
      } catch (error: any) {
        return { success: false, error: error.message };
      }

    case 'generate_design':
      try {
        const imageUrl = await generateImage(args.prompt);
        return { success: true, image_url: imageUrl };
      } catch (error: any) {
        return { success: false, error: error.message };
      }

    case 'get_orders':
      const { data: orders } = await supabase.from('orders').select('*');
      return { orders };

    case 'update_order_status':
      const { data: updatedOrder } = await supabase
        .from('orders')
        .update({ status: args.status })
        .eq('id', args.order_id)
        .select()
        .single();
      return { success: true, order: updatedOrder };

    case 'search_web':
      // Implement web search using Google Search API or similar
      return { results: `Search results for: ${args.query}` };

    case 'execute_workflow':
      try {
        const result = await executeRubeWorkflow(args.workflow_name, args.data);
        return { success: true, result };
      } catch (error: any) {
        return { success: false, error: error.message };
      }

    default:
      return { error: 'Unknown function' };
  }
}

const systemPrompt = `You are an autonomous AI agent managing KinkyBrizzle, an online apparel store. You have full control over the website and can:

1. Create and manage products (including generating designs with AI)
2. Process and update orders
3. Generate custom designs and logos
4. Search the web for information
5. Execute automated workflows via Rube.app
6. Integrate with Printful for product fulfillment

You should proactively help users by:
- Creating products when they describe what they want
- Generating designs based on descriptions
- Managing orders autonomously
- Providing comprehensive shopping assistance

Be conversational, helpful, and take action when appropriate. Always inform users what actions you're taking.`;

// OpenAI chat handler with function calling
async function chatWithOpenAI(
  client: OpenAI,
  message: string,
  previousMessages: any[],
  sessionId: string
) {
  const messages: any[] = [
    { role: 'system', content: systemPrompt }
  ];

  // Add conversation history
  if (previousMessages) {
    previousMessages.forEach(m => {
      messages.push({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.message
      });
    });
  }

  // Add current message
  messages.push({ role: 'user', content: message });

  // Convert tools to OpenAI format
  const openaiTools = tools.map(tool => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));

  let response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
    tools: openaiTools,
    tool_choice: 'auto'
  });

  let functionResults: any[] = [];
  let responseText = '';

  // Handle function calls
  while (response.choices[0].message.tool_calls) {
    const toolCalls = response.choices[0].message.tool_calls;
    
    messages.push(response.choices[0].message);

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      const result = await executeFunction(functionName, functionArgs, sessionId);
      
      functionResults.push({
        function: functionName,
        result
      });

      messages.push({
        role: 'tool' as const,
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }

    // Get next response
    response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: messages
    });
  }

  responseText = response.choices[0].message.content || '';

  return { responseText, functionResults };
}

// Gemini chat handler with function calling
async function chatWithGemini(
  ai: GoogleGenAI,
  message: string,
  sessionId: string
) {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemPrompt,
      tools: tools as any
    }
  });

  let response = await chat.sendMessage({ message });
  let responseText = '';
  let functionResults: any[] = [];

  // Handle function calls in a loop
  while (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0];
    const result = await executeFunction(
      functionCall.name || 'unknown',
      functionCall.args,
      sessionId
    );
    
    functionResults.push({
      function: functionCall.name,
      result
    });

    // Send function result back to model
    response = await chat.sendMessage({
      message: '',
      functionResponse: {
        name: functionCall.name || 'unknown',
        response: result
      }
    } as any);
  }

  responseText = response.text || '';

  return { responseText, functionResults };
}

// Chat endpoint with autonomous AI agent
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, session_id } = req.body;

    // Save user message
    await supabase.from('chat_history').insert({
      session_id,
      role: 'user',
      message
    });

    // Get previous context
    const { data: previousMessages } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', session_id)
      .order('created_at', { ascending: true })
      .limit(20);

    let responseText = '';
    let functionResults: any[] = [];
    let usedProvider = '';

    // Try OpenAI first, fallback to Gemini
    try {
      if (openaiClient) {
        usedProvider = 'OpenAI GPT-4';
        console.log('🤖 Using OpenAI GPT-4...');
        const result = await chatWithOpenAI(openaiClient, message, previousMessages || [], session_id);
        responseText = result.responseText;
        functionResults = result.functionResults;
      } else if (geminiAI) {
        usedProvider = 'Google Gemini';
        console.log('🤖 Using Google Gemini...');
        const result = await chatWithGemini(geminiAI, message, session_id);
        responseText = result.responseText;
        functionResults = result.functionResults;
      } else {
        throw new Error('No AI provider available');
      }
    } catch (error: any) {
      console.error(`❌ ${usedProvider} failed:`, error.message);
      
      // Fallback to alternative provider
      if (usedProvider.includes('OpenAI') && geminiAI) {
        console.log('🔄 Falling back to Google Gemini...');
        usedProvider = 'Google Gemini (fallback)';
        const result = await chatWithGemini(geminiAI, message, session_id);
        responseText = result.responseText;
        functionResults = result.functionResults;
      } else if (usedProvider.includes('Gemini') && openaiClient) {
        console.log('🔄 Falling back to OpenAI GPT-4...');
        usedProvider = 'OpenAI GPT-4 (fallback)';
        const result = await chatWithOpenAI(openaiClient, message, previousMessages || [], session_id);
        responseText = result.responseText;
        functionResults = result.functionResults;
      } else {
        throw error;
      }
    }

    // Save assistant message
    await supabase.from('chat_history').insert({
      session_id,
      role: 'assistant',
      message: responseText,
      metadata: { function_calls: functionResults, provider: usedProvider }
    });

    res.json({ 
      response: responseText,
      function_calls: functionResults,
      session_id,
      provider: usedProvider
    });

  } catch (error: any) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
router.get('/history/:sessionId', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', req.params.sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get AI actions log
router.get('/actions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('ai_actions')
      .select('*')
      .eq('session_id', req.params.sessionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
