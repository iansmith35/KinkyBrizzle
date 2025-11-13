# Railway Deployment Guide for KinkyBrizzle

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. All required API keys ready:
   - Supabase (URL, Anon Key, Service Role Key)
   - Google Gemini API Key
   - Printful API Key
   - (Optional) OpenAI API Key
   - (Optional) Rube.app API Key

## Step-by-Step Deployment

### 1. Set Up Supabase Database

Before deploying, you need to set up your Supabase database:

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned
3. Go to the SQL Editor in your Supabase dashboard
4. Copy the entire contents of `server/supabase/schema.sql`
5. Paste and run it in the SQL Editor
6. Verify that all tables were created successfully
7. Note down your:
   - Project URL (Settings → API → Project URL)
   - Anon/Public Key (Settings → API → anon public)
   - Service Role Key (Settings → API → service_role)

### 2. Push Your Code to GitHub

```bash
# If you haven't already
git init
git add .
git commit -m "Initial commit: KinkyBrizzle ready for Railway"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/KinkyBrizzle.git
git push -u origin main
```

### 3. Deploy to Railway

#### Option A: Using Railway Dashboard (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select the KinkyBrizzle repository
6. Railway will automatically detect the `railway.json` configuration

#### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### 4. Configure Environment Variables

In your Railway project dashboard:

1. Go to the "Variables" tab
2. Click "Add Variables"
3. Add each of the following:

```
PORT=3001
NODE_ENV=production

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

GEMINI_API_KEY=AIzaSy...

PRINTFUL_API_KEY=your_printful_key

OPENAI_API_KEY=sk-... (optional)

RUBE_API_KEY=your_rube_key (optional)

VITE_API_URL=https://your-app.railway.app
```

**Important**: For `VITE_API_URL`, use the Railway-provided domain (you'll get this after first deployment)

### 5. Update VITE_API_URL

After your first deployment:

1. Railway will provide a URL like `https://kinkybrizzle-production.up.railway.app`
2. Go back to Variables
3. Update `VITE_API_URL` to your Railway URL
4. The app will automatically redeploy

### 6. Verify Deployment

1. Click on your Railway deployment URL
2. You should see the KinkyBrizzle homepage
3. Test the AI chatbot
4. Try creating a product through the AI

## Monitoring & Logs

### View Logs
- In Railway dashboard, go to "Deployments" → Click on latest deployment
- View real-time logs to debug issues

### Health Check
- Your app has a health endpoint: `https://your-app.railway.app/health`
- Should return: `{"status":"ok","timestamp":"..."}`

## Common Issues & Solutions

### Build Failures

**Issue**: "Cannot find module 'express'"
**Solution**: Ensure all dependencies are in `dependencies` not `devDependencies`

**Issue**: TypeScript errors during build
**Solution**: Check `tsconfig.server.json` is configured correctly

### Runtime Errors

**Issue**: "Supabase connection failed"
**Solution**: 
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure database schema was applied

**Issue**: "AI not responding"
**Solution**:
- Verify GEMINI_API_KEY is valid
- Check API quotas in Google AI Studio
- Review server logs in Railway dashboard

### CORS Issues

**Issue**: Frontend can't connect to backend
**Solution**:
- Verify VITE_API_URL is set to Railway backend URL
- Check CORS is enabled in `server/index.ts`

## Scaling & Performance

### Horizontal Scaling
Railway automatically scales based on load. You can configure:
- Go to Settings → Scaling
- Adjust replica count if needed

### Database Connection Pooling
For high traffic, consider:
- Enabling Supabase connection pooling
- Using Supabase connection URL with pooler

## Custom Domain (Optional)

1. In Railway dashboard, go to Settings → Domains
2. Click "Add Domain"
3. Enter your custom domain
4. Update DNS records as shown
5. Update `VITE_API_URL` to your custom domain

## Continuous Deployment

Railway automatically redeploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway automatically deploys!
```

## Cost Optimization

Railway offers:
- $5/month free credit
- Pay-as-you-go pricing
- Sleep inactive applications

To minimize costs:
1. Use Railway's free tier for development
2. Enable sleep mode for dev environments
3. Monitor usage in Railway dashboard

## Backup & Recovery

### Database Backups
- Supabase automatically backs up your database
- Configure backup retention in Supabase dashboard

### Application Backup
- Your code is in GitHub (version controlled)
- Railway keeps deployment history

## Support & Help

- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Project Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/KinkyBrizzle/issues)

---

## Quick Reference

### Deployment Checklist
- [ ] Supabase project created
- [ ] Database schema applied
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] All environment variables set
- [ ] First deployment successful
- [ ] VITE_API_URL updated
- [ ] Health check passing
- [ ] AI chatbot working
- [ ] Products can be created

### Required Environment Variables
```
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ GEMINI_API_KEY
✅ PRINTFUL_API_KEY
✅ VITE_API_URL
⭕ OPENAI_API_KEY (optional)
⭕ RUBE_API_KEY (optional)
```

---

**Congratulations! Your AI-powered e-commerce platform is now live! 🎉**
