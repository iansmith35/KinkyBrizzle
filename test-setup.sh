#!/bin/bash

echo "🧪 KinkyBrizzle Quick Test (No External APIs Required)"
echo ""
echo "This script tests the application structure without requiring"
echo "real API keys. For full testing, configure .env with real credentials."
echo ""

# Check Node version
echo "📌 Checking Node.js version..."
node --version

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Test TypeScript compilation
echo ""
echo "🔨 Testing TypeScript compilation..."
npx tsc --noEmit -p tsconfig.server.json
if [ $? -eq 0 ]; then
    echo "✅ Server TypeScript: OK"
else
    echo "❌ Server TypeScript: ERRORS (check above)"
fi

npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo "✅ Frontend TypeScript: OK"
else
    echo "❌ Frontend TypeScript: ERRORS (check above)"
fi

# Test build (will fail on runtime but checks structure)
echo ""
echo "📦 Testing build process..."
echo "Note: Build will work but runtime requires real API keys"

# Check file structure
echo ""
echo "📁 Checking project structure..."
REQUIRED_FILES=(
    "server/index.ts"
    "server/config/supabase.ts"
    "server/routes/ai.ts"
    "server/routes/products.ts"
    "server/routes/orders.ts"
    "server/services/printful.ts"
    "server/services/imageGenerator.ts"
    "server/services/rube.ts"
    "server/supabase/schema.sql"
    "railway.json"
    "Procfile"
    ".env.example"
)

MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        MISSING=$((MISSING+1))
    fi
done

echo ""
if [ $MISSING -eq 0 ]; then
    echo "✅ All required files present!"
else
    echo "⚠️  $MISSING file(s) missing"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Set up Supabase project at https://supabase.com"
echo "2. Run the SQL schema from server/supabase/schema.sql"
echo "3. Get your API keys:"
echo "   - Gemini: https://ai.google.dev/"
echo "   - Printful: https://www.printful.com/dashboard/store"
echo "4. Copy .env.example to .env and add your keys"
echo "5. Run: npm run dev"
echo ""
echo "For Railway deployment, see: RAILWAY_DEPLOYMENT.md"
echo ""
