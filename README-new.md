<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KinkyBrizzle - AI-Powered Autonomous E-Commerce Platform

An intelligent, AI-driven online apparel store powered by Google Gemini, featuring autonomous operations, custom design generation, and seamless integrations with Printful, Supabase, and Rube.app.

## 🚀 Features

- **Autonomous AI Agent**: Chat with an AI that can create products, manage orders, generate designs, and run your entire store
- **AI-Powered Design Generation**: Create custom logos and clothing designs using AI image generation
- **Real-time Product Management**: Integrated with Printful for automated product fulfillment
- **Persistent Memory**: Supabase database for storing products, orders, cart, and conversation history
- **Workflow Automation**: Rube.app integration for connecting to external services
- **Age Verification**: Built-in age gate for adult content
- **Modern React UI**: Beautiful, responsive interface with dark mode support

## 🛠 Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for fast development
- TailwindCSS for styling
- React Router for navigation

### Backend
- Node.js + Express
- TypeScript
- Google Gemini 2.5 Flash with function calling
- Supabase (PostgreSQL) for database
- Printful API for product fulfillment
- Image generation (OpenAI DALL-E or Gemini Imagen)
- Rube.app for workflow automation

## 📋 Prerequisites

- Node.js 18+ 
- A Supabase account and project
- Google Gemini API key
- Printful account and API key
- (Optional) OpenAI API key for DALL-E image generation
- (Optional) Rube.app API key for workflow automation

## 🏗 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/iansmith35/KinkyBrizzle.git
cd KinkyBrizzle
npm install
```

### 2. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and API keys
3. Run the schema SQL from `server/supabase/schema.sql` in the Supabase SQL Editor

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# AI
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key_optional

# Printful
PRINTFUL_API_KEY=your_printful_key

# Rube.app (optional)
RUBE_API_KEY=your_rube_key

# Frontend
VITE_API_URL=http://localhost:3001
```

### 4. Run Locally

Development mode (runs both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

Visit `http://localhost:5173` to see the app!

## 🚂 Deploy to Railway

### Quick Deploy

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login to Railway:
```bash
railway login
```

3. Initialize and deploy:
```bash
railway init
railway up
```

4. Add environment variables in Railway dashboard:
   - Go to your project settings
   - Add all variables from `.env.example`

### Manual Deploy

1. Create a new project on [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway will detect the `railway.json` configuration
4. Add environment variables in the project settings
5. Deploy!

### Environment Variables for Railway

Make sure to set these in your Railway project:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `PRINTFUL_API_KEY`
- `OPENAI_API_KEY` (optional)
- `RUBE_API_KEY` (optional)
- `VITE_API_URL` (set to your Railway backend URL)

## 🤖 Using the AI Agent

The AI agent can autonomously:

1. **Create Products**: "Create a t-shirt with a cool logo about space exploration"
2. **Generate Designs**: "Generate a logo for a coffee shop called 'Bean Dreams'"
3. **Manage Orders**: "Show me all pending orders" or "Update order #123 to shipped"
4. **Search Information**: "Find trending fashion styles for 2025"
5. **Execute Workflows**: Automatically sync to Etsy, post to social media, send emails

Just chat naturally with the AI - it will take appropriate actions!

## 📁 Project Structure

```
KinkyBrizzle/
├── server/                 # Backend API
│   ├── index.ts           # Express server entry
│   ├── config/            # Configuration files
│   ├── routes/            # API routes
│   ├── services/          # External service integrations
│   └── supabase/          # Database schema
├── components/            # React components
├── pages/                 # Page components
├── services/              # Frontend services
├── context/               # React context
├── hooks/                 # Custom React hooks
├── railway.json           # Railway configuration
├── Procfile              # Process configuration
└── package.json          # Dependencies and scripts
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status

### AI Agent
- `POST /api/ai/chat` - Chat with AI agent
- `GET /api/ai/history/:sessionId` - Get chat history
- `GET /api/ai/actions/:sessionId` - Get AI actions log

### Cart
- `GET /api/cart/:sessionId` - Get cart
- `POST /api/cart` - Add to cart
- `PATCH /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

## 🎨 Customization

### Modify AI Behavior

Edit the system instruction in `server/routes/ai.ts`:

```typescript
systemInstruction: `Your custom instructions here...`
```

### Add New AI Tools

Add new function definitions in `server/routes/ai.ts` in the `tools` array and implement them in `executeFunction`.

### Styling

The app uses TailwindCSS. Customize colors and theme in `index.tsx` or component files.

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env`
- Check that RLS policies are correctly set up
- Ensure database schema is fully migrated

### AI Not Responding
- Check `GEMINI_API_KEY` is valid
- Verify API quotas haven't been exceeded
- Check browser console and server logs

### Printful Integration Issues
- Verify API key is correct
- Ensure you have products set up in Printful dashboard
- Check Printful API documentation for current endpoints

## 📝 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues or questions, please open a GitHub issue or contact the maintainer.

---

Built with ❤️ using Google Gemini, Supabase, and Railway
