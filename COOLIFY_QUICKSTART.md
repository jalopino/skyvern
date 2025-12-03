# Skyvern on Coolify - Quick Start Guide

Get Skyvern running on Coolify in 10 minutes! 🚀

## What You'll Need

- ✅ A running Coolify instance
- ✅ An LLM API key (OpenAI, Anthropic, Gemini, or Azure)
- ✅ 5-10 minutes

## Step 1: Create PostgreSQL Database (2 minutes)

1. Open your Coolify dashboard
2. Go to your project → **"Add Resource"** → **"Database"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `skyvern-db`
   - **PostgreSQL Version**: `14` or higher
   - **Database Name**: `skyvern`
   - **Username**: `skyvern`
   - **Password**: Generate or use `skyvern` (change in production!)
4. Click **"Deploy"**
5. Wait for the database to be healthy (green status)

## Step 2: Deploy Skyvern Backend (3 minutes)

1. In Coolify → **"Add Resource"** → **"Application"**
2. **Source**:
   - Choose **"Public Repository"**
   - Repository: `https://github.com/Skyvern-AI/skyvern`
   - Branch: `main`
3. **Build Configuration**:
   - Build Pack: **"Docker Compose"**
   - Docker Compose Location: `docker-compose.yml`
   - Service: `skyvern`
4. **Ports**:
   - Add port: `8000`
   - Add port: `9222` (optional, for debugging)
5. **Environment Variables** - Click "Add" for each:

   ```bash
   # Database (replace PASSWORD with your PostgreSQL password)
   DATABASE_STRING=postgresql+psycopg://skyvern:PASSWORD@skyvern-db:5432/skyvern
   
   # Browser
   BROWSER_TYPE=chromium-headless
   BROWSER_ACTION_TIMEOUT_MS=5000
   MAX_SCRAPING_RETRIES=3
   
   # Environment
   ENV=production
   PORT=8000
   LOG_LEVEL=INFO
   
   # LLM - Choose ONE option:
   # Option A: OpenAI
   ENABLE_OPENAI=true
   OPENAI_API_KEY=sk-proj-your-key-here
   LLM_KEY=OPENAI_GPT4O
   
   # Option B: Anthropic (Claude)
   # ENABLE_ANTHROPIC=true
   # ANTHROPIC_API_KEY=sk-ant-your-key-here
   # LLM_KEY=ANTHROPIC_CLAUDE3.5_SONNET
   
   # Option C: Gemini
   # ENABLE_GEMINI=true
   # GEMINI_API_KEY=your-gemini-key
   # LLM_KEY=GEMINI
   ```

6. **Persistent Storage** (recommended):
   - Add volume: `/data/artifacts`
   - Add volume: `/data/videos`
   - Add volume: `/data/har`
   - Add volume: `/data/log`
   - Add volume: `/.streamlit`

7. **Connect to Database**:
   - Go to "Resources" section
   - Link the `skyvern-db` database

8. Click **"Deploy"**

## Step 3: Deploy Skyvern UI (3 minutes)

1. **"Add Resource"** → **"Application"** (again)
2. **Source**: Same repository
   - Repository: `https://github.com/Skyvern-AI/skyvern`
   - Branch: `main`
3. **Build Configuration**:
   - Build Pack: **"Docker Compose"**
   - Docker Compose Location: `docker-compose.yml`
   - Service: `skyvern-ui`
4. **Ports**:
   - Add port: `8080`
   - Add port: `9090`
5. **Environment Variables**:

   ```bash
   # Replace with your Coolify-assigned backend URL
   # OR use internal service name if on same network
   VITE_API_BASE_URL=http://skyvern:8000/api/v1
   VITE_WSS_BASE_URL=ws://skyvern:8000/api/v1
   VITE_ARTIFACT_API_BASE_URL=http://skyvern:9090
   ```

   **If you have custom domains:**
   ```bash
   VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
   VITE_WSS_BASE_URL=wss://api.yourdomain.com/api/v1
   VITE_ARTIFACT_API_BASE_URL=https://artifacts.yourdomain.com
   ```

6. **Persistent Storage**:
   - Share the same volumes as backend:
     - `/data/artifacts`
     - `/data/videos`
     - `/data/har`
     - `/.streamlit`

7. **Connect Services**:
   - Link to the `skyvern` backend service
   - Link to the `skyvern-db` database (optional)

8. Click **"Deploy"**

## Step 4: Get Your API Key (2 minutes)

After the backend finishes deploying:

1. Go to the **Skyvern backend** service in Coolify
2. Click **"Logs"**
3. Look for this message:

   ```
   ==========================================
   🔑 IMPORTANT: Your Skyvern API Key
   ==========================================
   API Token: skyvern_xxxxxxxxxxxxxxxxxxxxx
   ==========================================
   ```

4. **Copy and save this API key!**

Alternatively, you can:
- Open the Skyvern UI and go to **Settings**
- The API key will be displayed there

## Step 5: Access Skyvern ✅

1. **Open the UI**: Go to your Skyvern UI URL (assigned by Coolify)
2. **You're done!** 🎉

## Quick Test

Try this in the UI:

1. Go to **"Tasks"**
2. Click **"Create Task"**
3. Enter:
   - **URL**: `https://www.google.com`
   - **Prompt**: `Search for "Skyvern automation"`
4. Click **"Run Task"**

You should see Skyvern navigate to Google and perform the search!

## Common Issues & Fixes

### Backend won't start

**Problem**: Database connection error

**Fix**: 
- Check that `skyvern-db` is running (green status)
- Verify `DATABASE_STRING` has the correct password
- Make sure the database is linked to the backend service

---

**Problem**: LLM errors

**Fix**:
- Verify your API key is valid
- Check that `ENABLE_[PROVIDER]=true`
- Ensure `LLM_KEY` matches the provider (e.g., `OPENAI_GPT4O` for OpenAI)
- Confirm you have API credits

---

**Problem**: Browser timeout errors

**Fix**:
- Increase `BROWSER_ACTION_TIMEOUT_MS=10000`
- Add more CPU/RAM to the container
- Check container logs for Chromium errors

### UI can't connect to backend

**Problem**: API connection errors

**Fix**:
- Verify the backend is running (green status)
- Check that `VITE_API_BASE_URL` points to the correct backend URL
- Test the backend API directly: `curl http://your-backend-url:8000/api/v1/health`
- Ensure both services are on the same Coolify network

---

**Problem**: WebSocket connection failed

**Fix**:
- Check `VITE_WSS_BASE_URL` uses `ws://` (not `http://`)
- For HTTPS/custom domains, use `wss://` (not `ws://`)
- Verify the backend port 8000 is accessible

### No artifacts/videos showing

**Problem**: Can't see recordings or artifacts

**Fix**:
- Verify persistent volumes are mounted correctly
- Check that both backend and UI share the same volumes
- Ensure the artifact server (port 9090) is accessible
- Verify `VITE_ARTIFACT_API_BASE_URL` is correct

## Next Steps

### Configure Custom Domains

1. In Coolify, add custom domains:
   - Backend: `api.yourdomain.com`
   - Frontend: `skyvern.yourdomain.com`
   - Artifacts: `artifacts.yourdomain.com`

2. Update UI environment variables to use your domains

3. Enable SSL/TLS in Coolify (automatic with Let's Encrypt)

### Add Bitwarden Integration

For password management:

```bash
SKYVERN_AUTH_BITWARDEN_ORGANIZATION_ID=your-org-id
SKYVERN_AUTH_BITWARDEN_CLIENT_ID=user.your-client-id
SKYVERN_AUTH_BITWARDEN_CLIENT_SECRET=your-secret
SKYVERN_AUTH_BITWARDEN_MASTER_PASSWORD=your-password
```

See `COOLIFY_ENV_VARIABLES.md` for details.

### Scale for Production

- Increase container resources (4GB+ RAM, 2+ CPU cores)
- Use a managed PostgreSQL service
- Set up automated backups
- Enable monitoring and logging
- Configure rate limiting

## Additional Resources

- 📖 **Full Deployment Guide**: `COOLIFY_DEPLOYMENT.md`
- 📋 **Environment Variables**: `COOLIFY_ENV_VARIABLES.md`
- 🔧 **Example Config**: `env.coolify.example`
- 🌐 **Skyvern Docs**: https://docs.skyvern.com
- 💬 **Get Help**: https://github.com/Skyvern-AI/skyvern/issues

## Need Help?

- **Skyvern Issues**: https://github.com/Skyvern-AI/skyvern/issues
- **Coolify Discord**: https://coolify.io/discord
- **Coolify Docs**: https://coolify.io/docs

---

**Enjoy automating the web with Skyvern! 🚀**

