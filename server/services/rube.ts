import axios from 'axios';

// Rube.app API integration for workflow automation
const RUBE_API_KEY = process.env.RUBE_API_KEY || '';
const RUBE_API_BASE = 'https://api.rube.app/v1';

const rubeClient = axios.create({
  baseURL: RUBE_API_BASE,
  headers: {
    'Authorization': `Bearer ${RUBE_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export async function executeRubeWorkflow(workflowName: string, data: any = {}) {
  try {
    if (!RUBE_API_KEY) {
      console.warn('Rube.app API key not configured');
      return { success: false, message: 'Rube.app not configured' };
    }

    console.log(`Executing Rube workflow: ${workflowName}`, data);
    
    // Execute workflow
    const response = await rubeClient.post('/workflows/execute', {
      workflow: workflowName,
      input: data
    });

    return response.data;
  } catch (error: any) {
    console.error('Rube.app workflow error:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

// Predefined workflows
export async function postToSocialMedia(platform: string, content: string, imageUrl?: string) {
  return executeRubeWorkflow('social_media_post', {
    platform,
    content,
    image_url: imageUrl
  });
}

export async function sendCustomerEmail(to: string, subject: string, body: string) {
  return executeRubeWorkflow('send_email', {
    to,
    subject,
    body
  });
}

export async function syncToEtsyShop(productData: any) {
  return executeRubeWorkflow('etsy_sync', {
    product: productData
  });
}

export async function createShopifyProduct(productData: any) {
  return executeRubeWorkflow('shopify_create_product', {
    product: productData
  });
}
