#!/bin/bash

# KinkyBrizzle Startup Script

echo "🚀 Starting KinkyBrizzle..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Please copy .env.example to .env and configure your API keys"
    exit 1
fi

# Check for required environment variables
if ! grep -q "GEMINI_API_KEY=your_gemini" .env; then
    echo "✅ Environment variables configured"
else
    echo "⚠️  Please configure your API keys in .env file"
    echo "Required: GEMINI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY"
    exit 1
fi

# Build backend
echo "📦 Building backend..."
npm run build:backend

if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
npm run build:frontend

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "To start the production server:"
echo "  npm start"
echo ""
echo "To start in development mode:"
echo "  npm run dev"
echo ""
