# Issues in Your Current Environment Configuration

## ❌ CRITICAL ISSUES

### 1. Invalid LLM Model Names
```bash
LLM_KEY=OPENAI_GPT5  # ❌ WRONG - GPT-5 doesn't exist!
SECONDARY_LLM_KEY=OPENAI_GPT5_NANO  # ❌ WRONG - This doesn't exist either!
```

**Problem:** OpenAI doesn't have GPT-5 models yet. The latest is GPT-4o.

**Fix:**
```bash
LLM_KEY=OPENAI_GPT4O
SECONDARY_LLM_KEY=OPENAI_GPT4O_MINI
```

### 2. Artifact Server Port Configuration
```bash
VITE_ARTIFACT_API_BASE_URL=https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com:9090
```

**Problem:** Port 9090 might not be exposed through your load balancer/proxy. Artifacts won't load.

**Fix Option 1 (Recommended):** Backend serves artifacts on same domain
```bash
# In Coolify, expose port 9090 in the backend service
# Then use:
VITE_ARTIFACT_API_BASE_URL=https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com:9090
```

**Fix Option 2:** Use backend to proxy artifact requests (no separate port)
```bash
VITE_ARTIFACT_API_BASE_URL=https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com
# Requires backend route changes - not recommended
```

### 3. Wrong Browser Type for Production
```bash
BROWSER_TYPE=chromium-headful  # ❌ WRONG for Docker/production
```

**Problem:** Headful browsers need X11 display server. Use headless in production.

**Fix:**
```bash
BROWSER_TYPE=chromium-headless
```

### 4. Missing Storage Paths
```bash
VIDEO_PATH=./videos  # ❌ Relative path
# Missing: HAR_PATH, LOG_PATH, ARTIFACT_STORAGE_PATH
```

**Problem:** In Docker, relative paths won't work. Need absolute paths.

**Fix:**
```bash
VIDEO_PATH=/data/videos
HAR_PATH=/data/har
LOG_PATH=/data/log
ARTIFACT_STORAGE_PATH=/data/artifacts
```

### 5. No Retry Logic
```bash
MAX_SCRAPING_RETRIES=0  # ❌ No retries means failures are more likely
```

**Fix:**
```bash
MAX_SCRAPING_RETRIES=3
```

### 6. Wrong Database Configuration
```bash
DATABASE_STRING=postgresql+psycopg://skyvern@localhost/skyvern
```

**Problem:** In Docker/Coolify, database isn't at "localhost"

**Fix:** Use your Coolify PostgreSQL service name
```bash
DATABASE_STRING=postgresql+psycopg://skyvern:YOUR_PASSWORD@postgres:5432/skyvern
# Or use the Coolify-provided DATABASE_STRING
```

## ⚠️ SECURITY ISSUES

### 7. Exposed API Key
```bash
OPENAI_API_KEY=sk-proj-Tk9W7xa5Mg8eZNHcqSXB...  # 🔓 Exposed in this chat!
```

**URGENT:** This API key is now compromised! Anyone reading this can see it.

**Action Required:**
1. Go to OpenAI dashboard: https://platform.openai.com/api-keys
2. Revoke this key immediately
3. Generate a new key
4. Update your environment with the new key
5. Never share your API keys publicly

## ✅ CORRECTED CONFIGURATION

Here's what your environment should look like:

```bash
# ============================================================================
# SERVICE URLS (Coolify-managed - don't change these)
# ============================================================================
SERVICE_FQDN_SKYVERN=ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com
SERVICE_FQDN_SKYVERN_UI=ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com
SERVICE_URL_SKYVERN=https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com
SERVICE_URL_SKYVERN_UI=https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com

# ============================================================================
# ENVIRONMENT
# ============================================================================
ENV=production  # Changed from "local" since this is production
PORT=8000
LOG_LEVEL=INFO
ANALYTICS_ID=anonymous

# ============================================================================
# DATABASE (Update with your actual PostgreSQL credentials)
# ============================================================================
DATABASE_STRING=postgresql+psycopg://skyvern:YOUR_PASSWORD@postgres-service-name:5432/skyvern

# ============================================================================
# LLM CONFIGURATION - FIXED
# ============================================================================
ENABLE_OPENAI=true
OPENAI_API_KEY=YOUR_NEW_API_KEY_HERE  # ⚠️ Get new key after revoking old one
LLM_KEY=OPENAI_GPT4O  # Fixed: was OPENAI_GPT5
SECONDARY_LLM_KEY=OPENAI_GPT4O_MINI  # Fixed: was OPENAI_GPT5_NANO

# ============================================================================
# BROWSER CONFIGURATION - FIXED
# ============================================================================
BROWSER_TYPE=chromium-headless  # Fixed: was chromium-headful
BROWSER_ACTION_TIMEOUT_MS=5000
MAX_SCRAPING_RETRIES=3  # Fixed: was 0

# ============================================================================
# STORAGE PATHS - FIXED
# ============================================================================
VIDEO_PATH=/data/videos  # Fixed: was ./videos
HAR_PATH=/data/har  # Added
LOG_PATH=/data/log  # Added
ARTIFACT_STORAGE_PATH=/data/artifacts  # Added

# ============================================================================
# AGENT CONFIGURATION
# ============================================================================
MAX_STEPS_PER_RUN=50
ENABLE_LOG_ARTIFACTS=true  # Changed to true for debugging

# ============================================================================
# FRONTEND URLS (for UI container)
# ============================================================================
VITE_API_BASE_URL=https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com/api/v1
VITE_WSS_BASE_URL=wss://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com/api/v1

# ⚠️ IMPORTANT: Make sure port 9090 is exposed in Coolify!
VITE_ARTIFACT_API_BASE_URL=https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com:9090

# ============================================================================
# OPTIONAL: Simple UI Authentication
# ============================================================================
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=admin
VITE_UI_AUTH_PASSWORD=your-secure-password-here

# ============================================================================
# OTHER PROVIDERS (Disabled)
# ============================================================================
ENABLE_ANTHROPIC=false
ENABLE_AZURE=false
ENABLE_GEMINI=false
ENABLE_NOVITA=false
ENABLE_VOLCENGINE=false
ENABLE_AZURE_GPT4O_MINI=false
ENABLE_AZURE_GPT5=false
ENABLE_AZURE_GPT5_MINI=false
ENABLE_AZURE_GPT5_NANO=false

# ============================================================================
# BITWARDEN (Optional - if using password manager)
# ============================================================================
# SKYVERN_AUTH_BITWARDEN_ORGANIZATION_ID=your-org-id-here
# SKYVERN_AUTH_BITWARDEN_CLIENT_ID=user.your-client-id-here
# SKYVERN_AUTH_BITWARDEN_CLIENT_SECRET=your-client-secret-here
# SKYVERN_AUTH_BITWARDEN_MASTER_PASSWORD=your-master-password-here

# ============================================================================
# 1PASSWORD (Optional - if using 1Password)
# ============================================================================
# OP_SERVICE_ACCOUNT_TOKEN=
```

## 🔧 COOLIFY SPECIFIC CONFIGURATION

### In Coolify Backend Service:
1. Add these environment variables
2. Ensure port 9090 is exposed (for artifact server)
3. Mount persistent volumes:
   - `/data/artifacts`
   - `/data/videos`
   - `/data/har`
   - `/data/log`

### In Coolify Frontend Service:
1. Add the VITE_* variables
2. Add UI authentication variables (if desired)

## 📝 SUMMARY OF CHANGES

| Variable | Old Value | New Value | Why |
|----------|-----------|-----------|-----|
| LLM_KEY | OPENAI_GPT5 | OPENAI_GPT4O | GPT-5 doesn't exist |
| SECONDARY_LLM_KEY | OPENAI_GPT5_NANO | OPENAI_GPT4O_MINI | Model doesn't exist |
| BROWSER_TYPE | chromium-headful | chromium-headless | Production needs headless |
| VIDEO_PATH | ./videos | /data/videos | Docker needs absolute paths |
| MAX_SCRAPING_RETRIES | 0 | 3 | Enable retry logic |
| ENABLE_LOG_ARTIFACTS | false | true | Better debugging |
| HAR_PATH | (missing) | /data/har | Required path |
| LOG_PATH | (missing) | /data/log | Required path |
| ARTIFACT_STORAGE_PATH | (missing) | /data/artifacts | Required path |
| ENV | local | production | Reflects actual environment |
| OPENAI_API_KEY | (compromised) | (new key needed) | Security |

## 🚀 NEXT STEPS

1. **URGENT:** Revoke the exposed OpenAI API key
2. Generate a new API key
3. Update your Coolify environment variables with the fixes above
4. Restart both services (backend and frontend)
5. Verify artifacts and streaming work

