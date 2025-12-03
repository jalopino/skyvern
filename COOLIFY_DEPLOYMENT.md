# Deploying Skyvern to Coolify

This guide will walk you through deploying Skyvern to Coolify, a self-hosted alternative to Heroku/Netlify.

## Prerequisites

- A Coolify instance running (self-hosted or cloud)
- Docker installed on your Coolify server
- An LLM API key (OpenAI, Anthropic, Azure, or Gemini)
- PostgreSQL database (can be created in Coolify)

## Deployment Steps

### 1. Create PostgreSQL Database in Coolify

1. In your Coolify dashboard, navigate to your project
2. Click "Add Resource" → "Database" → "PostgreSQL"
3. Configure the database:
   - **Name**: `skyvern-postgres` (or any name you prefer)
   - **Version**: `14` or higher
   - **Username**: `skyvern`
   - **Password**: Generate a secure password or use `skyvern` for testing
   - **Database Name**: `skyvern`
4. Deploy the database and wait for it to be running

### 2. Deploy Skyvern Backend

1. In Coolify, click "Add Resource" → "Application"
2. Choose "Docker Compose" as the deployment type
3. Connect your Git repository or use the public Skyvern repo:
   - **Repository**: `https://github.com/Skyvern-AI/skyvern.git`
   - **Branch**: `main`
   - **Docker Compose File**: `docker-compose.yml`
   - **Base Directory**: Leave empty (root)

4. Configure the service:
   - **Service Name**: `skyvern` (this matches the service in docker-compose.yml)
   - **Port Mappings**: 
     - Internal Port: `8000` → External: `8000` (Coolify will handle the external URL)
     - Internal Port: `9222` → External: `9222` (optional, for CDP browser debugging)

5. Configure Environment Variables (click "Add Environment Variable"):

   **Required Variables:**
   ```bash
   # Database Connection
   DATABASE_STRING=postgresql+psycopg://skyvern:YOUR_PASSWORD@skyvern-postgres:5432/skyvern
   
   # Browser Configuration
   BROWSER_TYPE=chromium-headless
   BROWSER_ACTION_TIMEOUT_MS=5000
   MAX_SCRAPING_RETRIES=3
   
   # Storage Paths
   VIDEO_PATH=/data/videos
   HAR_PATH=/data/har
   LOG_PATH=/data/log
   ARTIFACT_STORAGE_PATH=/data/artifacts
   
   # Environment
   ENV=production
   PORT=8000
   LOG_LEVEL=INFO
   MAX_STEPS_PER_RUN=50
   
   # LLM Configuration (choose ONE and uncomment):
   # For OpenAI:
   ENABLE_OPENAI=true
   OPENAI_API_KEY=sk-your-openai-key
   LLM_KEY=OPENAI_GPT4O
   
   # For Anthropic:
   # ENABLE_ANTHROPIC=true
   # ANTHROPIC_API_KEY=sk-ant-your-key
   # LLM_KEY=ANTHROPIC_CLAUDE3.5_SONNET
   
   # For Azure OpenAI:
   # ENABLE_AZURE=true
   # AZURE_DEPLOYMENT=your-deployment-name
   # AZURE_API_KEY=your-azure-key
   # AZURE_API_BASE=https://your-resource.openai.azure.com/
   # AZURE_API_VERSION=2024-08-01-preview
   # LLM_KEY=AZURE_OPENAI
   
   # Analytics
   ANALYTICS_ID=anonymous
   ENABLE_LOG_ARTIFACTS=false
   ```

6. Configure Persistent Storage (optional but recommended):
   - Add volume mounts for persistent data:
     - `/data/artifacts` → to store task artifacts
     - `/data/videos` → to store recorded videos
     - `/data/har` → to store HAR files
     - `/data/log` → to store logs
     - `/.streamlit` → to persist Streamlit configuration

7. Configure Network:
   - Link the PostgreSQL database to the Skyvern service
   - Coolify will automatically create a network connection

8. Deploy the Skyvern backend

### 3. Deploy Skyvern UI (Frontend)

1. In Coolify, click "Add Resource" → "Application" again
2. Use the same repository but different service:
   - **Repository**: Same as backend
   - **Service Name**: `skyvern-ui`
   - **Port Mappings**:
     - Internal Port: `8080` → External: `8080`
     - Internal Port: `9090` → External: `9090` (artifact server)

3. Configure Environment Variables:
   ```bash
   # Replace 'your-backend-url' with your Coolify-assigned domain for the backend
   # OR use the internal service name if on the same network
   
   # Option 1: Using Coolify public URLs
   VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
   VITE_WSS_BASE_URL=wss://your-backend-domain.com/api/v1
   VITE_ARTIFACT_API_BASE_URL=https://your-backend-domain.com:9090
   
   # Option 2: Using internal service names (if on same network)
   VITE_API_BASE_URL=http://skyvern:8000/api/v1
   VITE_WSS_BASE_URL=ws://skyvern:8000/api/v1
   VITE_ARTIFACT_API_BASE_URL=http://skyvern:9090
   ```

4. Configure Persistent Storage:
   - Share the same volumes as the backend:
     - `/data/artifacts`
     - `/data/videos`
     - `/data/har`
     - `/.streamlit`

5. Deploy the Skyvern UI

### 4. Configure Domain Names (Optional)

For a production setup, configure custom domains in Coolify:

1. **Backend API**: `api.yourdomain.com` → `skyvern:8000`
2. **Frontend UI**: `skyvern.yourdomain.com` → `skyvern-ui:8080`
3. **Artifact Server**: `artifacts.yourdomain.com` → `skyvern-ui:9090`

Update the UI environment variables to use these domains:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_WSS_BASE_URL=wss://api.yourdomain.com/api/v1
VITE_ARTIFACT_API_BASE_URL=https://artifacts.yourdomain.com
```

### 5. Get Your API Key

After deployment, the backend will automatically:
1. Run database migrations
2. Create a default organization called "Skyvern-Open-Source"
3. Generate an API key

To retrieve your API key:

**Method 1: Check the backend logs**
```bash
# In Coolify, go to your skyvern service and view logs
# Look for a line like:
# API Token: skyvern_xxxxxxxxxxxxx
```

**Method 2: Access via UI**
1. Open your Skyvern UI at `https://skyvern.yourdomain.com` (or Coolify-assigned URL)
2. The UI will automatically read the API key from the `.streamlit/secrets.toml` file
3. Go to Settings to view or regenerate your API key

**Method 3: Manually create an API key**
```bash
# SSH into your Coolify server or use Coolify's terminal
# Navigate to the skyvern container
docker exec -it <skyvern-container-id> bash

# Run the organization creation script
python scripts/create_organization.py "Your-Org-Name"

# Copy the generated API token
```

## Environment Variables Reference

See `env.coolify.example` for all available configuration options.

### Minimal Required Variables

```bash
DATABASE_STRING=postgresql+psycopg://user:pass@host:5432/db
BROWSER_TYPE=chromium-headless
ENABLE_OPENAI=true  # or ENABLE_ANTHROPIC, ENABLE_AZURE, etc.
OPENAI_API_KEY=sk-your-key  # or corresponding key for your LLM provider
LLM_KEY=OPENAI_GPT4O  # or your chosen model
```

### Recommended Production Variables

```bash
ENV=production
LOG_LEVEL=INFO
MAX_STEPS_PER_RUN=50
BROWSER_ACTION_TIMEOUT_MS=5000
MAX_SCRAPING_RETRIES=3
ENABLE_LOG_ARTIFACTS=true
VIDEO_PATH=/data/videos
HAR_PATH=/data/har
LOG_PATH=/data/log
ARTIFACT_STORAGE_PATH=/data/artifacts
```

## Troubleshooting

### Backend won't start
- Check the logs in Coolify for error messages
- Verify the DATABASE_STRING is correct and the PostgreSQL service is running
- Ensure you have at least one LLM provider enabled and configured
- Verify the LLM_KEY matches an enabled provider

### UI can't connect to backend
- Verify the VITE_API_BASE_URL and VITE_WSS_BASE_URL are correct
- Check if the backend is accessible from the UI container
- Ensure the backend is running and healthy
- Check CORS settings if using custom domains

### Database migration errors
- Check PostgreSQL logs
- Verify the database user has sufficient permissions
- Try setting `ALLOWED_SKIP_DB_MIGRATION_VERSION` to skip migrations (use with caution)

### Browser automation not working
- Ensure BROWSER_TYPE is set to `chromium-headless` for Docker/Coolify
- Check if the container has enough resources (RAM/CPU)
- Verify playwright is properly installed in the container
- Check for missing dependencies with `playwright install-deps`

### Persistent storage not working
- Verify volume mounts are correctly configured in Coolify
- Check directory permissions inside the container
- Ensure the paths match between environment variables and volume mounts

## Scaling Considerations

For production workloads:

1. **Database**: Use a managed PostgreSQL service or add connection pooling
2. **Compute**: Increase container resources (2+ CPU cores, 4GB+ RAM recommended)
3. **Storage**: Use object storage (S3, MinIO) for artifacts instead of local volumes
4. **Monitoring**: Set up logging and monitoring (Sentry, Datadog, etc.)
5. **Backups**: Configure automated PostgreSQL backups in Coolify

## Security Best Practices

1. **Use strong passwords** for PostgreSQL and API keys
2. **Enable HTTPS** for all public endpoints
3. **Restrict access** to the backend API (use authentication)
4. **Keep secrets secure** - use Coolify's secret management
5. **Regular updates** - keep Skyvern and dependencies updated
6. **Network isolation** - use Coolify's internal networking
7. **Monitor logs** - watch for suspicious activity

## Support

For issues specific to Skyvern, visit:
- GitHub: https://github.com/Skyvern-AI/skyvern
- Documentation: https://docs.skyvern.com

For Coolify-specific issues:
- Coolify Docs: https://coolify.io/docs
- Coolify Discord: https://coolify.io/discord

