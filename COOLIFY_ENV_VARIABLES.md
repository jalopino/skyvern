# Coolify Environment Variables Reference

This document provides a comprehensive reference for all environment variables used in Skyvern when deploying to Coolify.

## Table of Contents

- [Required Variables](#required-variables)
- [LLM Provider Configuration](#llm-provider-configuration)
- [Browser Configuration](#browser-configuration)
- [Storage Configuration](#storage-configuration)
- [Database Configuration](#database-configuration)
- [Agent Configuration](#agent-configuration)
- [Logging Configuration](#logging-configuration)
- [Integration Configuration](#integration-configuration)
- [Advanced Configuration](#advanced-configuration)

## Required Variables

These variables MUST be set for Skyvern to work:

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_STRING` | `postgresql+psycopg://skyvern:pass@postgres:5432/skyvern` | PostgreSQL connection string |
| `BROWSER_TYPE` | `chromium-headless` | Browser type for web automation |
| `LLM_KEY` | `OPENAI_GPT4O` | The LLM model to use |
| `ENABLE_[PROVIDER]` | `true` | Enable at least one LLM provider (see below) |
| `[PROVIDER]_API_KEY` | `sk-...` | API key for the enabled LLM provider |

## LLM Provider Configuration

Skyvern requires at least ONE LLM provider to be configured. Choose the provider that best suits your needs.

### OpenAI Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_OPENAI` | Yes | `true` | Enable OpenAI as LLM provider |
| `OPENAI_API_KEY` | Yes | `sk-proj-...` | Your OpenAI API key |
| `LLM_KEY` | Yes | `OPENAI_GPT4O` | Model to use |
| `OPENAI_API_BASE` | No | `https://api.openai.com/v1` | Custom API base URL |
| `OPENAI_ORGANIZATION` | No | `org-...` | OpenAI organization ID |

**Available Models:**
- `OPENAI_GPT4O` - GPT-4 Optimized (recommended)
- `OPENAI_GPT4O_MINI` - Smaller, faster, cheaper
- `OPENAI_GPT4_TURBO` - GPT-4 Turbo
- `OPENAI_GPT4V` - GPT-4 Vision

### Anthropic (Claude) Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_ANTHROPIC` | Yes | `true` | Enable Anthropic as LLM provider |
| `ANTHROPIC_API_KEY` | Yes | `sk-ant-...` | Your Anthropic API key |
| `LLM_KEY` | Yes | `ANTHROPIC_CLAUDE3.5_SONNET` | Model to use |

**Available Models:**
- `ANTHROPIC_CLAUDE3.5_SONNET` - Claude 3.5 Sonnet (recommended)
- `ANTHROPIC_CLAUDE3_OPUS` - Claude 3 Opus
- `ANTHROPIC_CLAUDE3_SONNET` - Claude 3 Sonnet
- `ANTHROPIC_CLAUDE3_HAIKU` - Claude 3 Haiku

### Azure OpenAI Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_AZURE` | Yes | `true` | Enable Azure OpenAI |
| `AZURE_DEPLOYMENT` | Yes | `gpt-4o` | Your Azure deployment name |
| `AZURE_API_KEY` | Yes | `abc123...` | Your Azure API key |
| `AZURE_API_BASE` | Yes | `https://your-resource.openai.azure.com/` | Azure endpoint URL |
| `AZURE_API_VERSION` | Yes | `2024-08-01-preview` | Azure API version |
| `LLM_KEY` | Yes | `AZURE_OPENAI` | Set to AZURE_OPENAI |

**GPT-4o Mini Configuration (optional):**
- `ENABLE_AZURE_GPT4O_MINI` - Enable GPT-4o Mini
- `AZURE_GPT4O_MINI_DEPLOYMENT` - Deployment name
- `AZURE_GPT4O_MINI_API_KEY` - API key
- `AZURE_GPT4O_MINI_API_BASE` - Endpoint URL
- `AZURE_GPT4O_MINI_API_VERSION` - API version

**GPT-5 Configuration (optional, if available):**
- `ENABLE_AZURE_GPT5` - Enable GPT-5
- `AZURE_GPT5_DEPLOYMENT` - Deployment name (default: `gpt-5`)
- `AZURE_GPT5_API_KEY` - API key
- `AZURE_GPT5_API_BASE` - Endpoint URL
- `AZURE_GPT5_API_VERSION` - API version (default: `2025-01-01-preview`)

### Google Gemini Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_GEMINI` | Yes | `true` | Enable Gemini as LLM provider |
| `GEMINI_API_KEY` | Yes | `AIza...` | Your Gemini API key |
| `LLM_KEY` | Yes | `GEMINI` | Set to GEMINI |

**Available Models:**
- `GEMINI` - Latest Gemini model
- `GEMINI_2.5_PRO_PREVIEW_03_25` - Gemini 2.5 Pro

### Amazon Bedrock Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_BEDROCK` | Yes | `true` | Enable Amazon Bedrock |
| `LLM_KEY` | Yes | `BEDROCK_ANTHROPIC_CLAUDE3.5_SONNET` | Model to use |
| `AWS_REGION` | Yes | `us-west-2` | AWS region |
| `AWS_ACCESS_KEY_ID` | Yes | `AKIA...` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes | `secret...` | AWS secret key |

**Available Models:**
- `BEDROCK_ANTHROPIC_CLAUDE3.5_SONNET` - Claude 3.5 Sonnet V2
- `BEDROCK_ANTHROPIC_CLAUDE3.5_SONNET_V1` - Claude 3.5 Sonnet V1

### Ollama Configuration (Self-Hosted)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_OLLAMA` | Yes | `true` | Enable Ollama |
| `LLM_KEY` | Yes | `OLLAMA` | Set to OLLAMA |
| `OLLAMA_MODEL` | Yes | `qwen2.5:7b-instruct` | Ollama model name |
| `OLLAMA_SERVER_URL` | Yes | `http://ollama:11434` | Ollama server URL |
| `LLM_CONFIG_MAX_TOKENS` | No | `128000` | Max tokens (optional) |

### OpenRouter Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_OPENROUTER` | Yes | `true` | Enable OpenRouter |
| `LLM_KEY` | Yes | `OPENROUTER` | Set to OPENROUTER |
| `OPENROUTER_API_KEY` | Yes | `sk-or-...` | OpenRouter API key |
| `OPENROUTER_MODEL` | Yes | `mistralai/mistral-small-3.1-24b-instruct` | Model to use |
| `LLM_CONFIG_MAX_TOKENS` | No | `128000` | Max tokens (optional) |

### Groq Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_GROQ` | Yes | `true` | Enable Groq |
| `LLM_KEY` | Yes | `GROQ` | Set to GROQ |
| `GROQ_API_KEY` | Yes | `gsk_...` | Groq API key |
| `GROQ_MODEL` | Yes | `llama-3.1-8b-instant` | Model to use |

### Novita AI Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_NOVITA` | Yes | `true` | Enable Novita AI |
| `NOVITA_API_KEY` | Yes | `key...` | Novita API key |

### Volcengine Configuration (ByteDance Doubao)

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ENABLE_VOLCENGINE` | Yes | `true` | Enable Volcengine |
| `VOLCENGINE_API_KEY` | Yes | `key...` | Volcengine API key |
| `VOLCENGINE_API_BASE` | No | `https://ark.cn-beijing.volces.com/api/v3` | API base URL |

### Secondary LLM Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `SECONDARY_LLM_KEY` | No | `OPENAI_GPT4O_MINI` | Cheaper LLM for simple tasks |

If not set, `SECONDARY_LLM_KEY` defaults to `LLM_KEY`.

## Browser Configuration

| Variable | Required | Default | Example | Description |
|----------|----------|---------|---------|-------------|
| `BROWSER_TYPE` | Yes | - | `chromium-headless` | Browser type to use |
| `BROWSER_ACTION_TIMEOUT_MS` | No | `5000` | `10000` | Timeout for browser actions (ms) |
| `MAX_SCRAPING_RETRIES` | No | `0` | `3` | Number of retries for failed scrapes |

**Browser Type Options:**
- `chromium-headless` - Headless Chromium (recommended for Coolify)
- `chromium-headful` - Chromium with GUI (for local development)
- `cdp-connect` - Connect to external Chrome via CDP

## Storage Configuration

| Variable | Required | Default | Example | Description |
|----------|----------|---------|---------|-------------|
| `VIDEO_PATH` | No | `/data/videos` | `/data/videos` | Path to store videos |
| `HAR_PATH` | No | `/data/har` | `/data/har` | Path to store HAR files |
| `LOG_PATH` | No | `/data/log` | `/data/log` | Path to store logs |
| `ARTIFACT_STORAGE_PATH` | No | `/data/artifacts` | `/data/artifacts` | Path to store artifacts |

**Important:** Make sure to configure persistent volumes in Coolify for these paths!

## Database Configuration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_STRING` | Yes | `postgresql+psycopg://user:pass@host:5432/db` | PostgreSQL connection string |
| `ALLOWED_SKIP_DB_MIGRATION_VERSION` | No | `abc123def456` | Skip migrations for specific version |

**Database String Format:**
```
postgresql+psycopg://USERNAME:PASSWORD@HOSTNAME:PORT/DATABASE_NAME
```

**For Coolify:**
- If PostgreSQL is in the same Coolify network: `postgresql+psycopg://skyvern:password@postgres:5432/skyvern`
- Replace `postgres` with your PostgreSQL service name in Coolify

## Agent Configuration

| Variable | Required | Default | Example | Description |
|----------|----------|---------|---------|-------------|
| `ENV` | No | `local` | `production` | Environment name |
| `PORT` | No | `8000` | `8000` | Port for the API server |
| `MAX_STEPS_PER_RUN` | No | `50` | `100` | Max steps per agent run |
| `ENABLE_CODE_BLOCK` | No | `false` | `true` | Enable code execution blocks |

## Logging Configuration

| Variable | Required | Default | Example | Description |
|----------|----------|---------|---------|-------------|
| `LOG_LEVEL` | No | `INFO` | `DEBUG` | Logging level |
| `ENABLE_LOG_ARTIFACTS` | No | `false` | `true` | Save logs as artifacts |

**Log Level Options:**
- `DEBUG` - Detailed debugging information
- `INFO` - General information (recommended)
- `WARNING` - Warning messages only
- `ERROR` - Error messages only
- `CRITICAL` - Critical errors only

## Integration Configuration

### Bitwarden Integration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `SKYVERN_AUTH_BITWARDEN_ORGANIZATION_ID` | No | `org-id` | Bitwarden org ID |
| `SKYVERN_AUTH_BITWARDEN_CLIENT_ID` | No | `user.client-id` | Bitwarden client ID |
| `SKYVERN_AUTH_BITWARDEN_CLIENT_SECRET` | No | `secret` | Bitwarden client secret |
| `SKYVERN_AUTH_BITWARDEN_MASTER_PASSWORD` | No | `password` | Bitwarden master password |
| `BITWARDEN_SERVER` | No | `http://localhost` | Bitwarden server URL |
| `BITWARDEN_SERVER_PORT` | No | `8002` | Bitwarden server port |
| `BITWARDEN_MAX_RETRIES` | No | `3` | Max retries for Bitwarden ops |
| `BITWARDEN_TIMEOUT_SECONDS` | No | `60` | Timeout for Bitwarden ops |

### 1Password Integration

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `OP_SERVICE_ACCOUNT_TOKEN` | No | `token...` | 1Password service account token |

## Advanced Configuration

### Analytics

| Variable | Required | Default | Example | Description |
|----------|----------|---------|---------|-------------|
| `ANALYTICS_ID` | No | `anonymous` | `your-id` | Analytics tracking ID |

### Migration Control

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `ALLOWED_SKIP_DB_MIGRATION_VERSION` | No | `abc123def456` | Skip migrations if DB matches this version |

**Warning:** Only use `ALLOWED_SKIP_DB_MIGRATION_VERSION` if you're rolling back to an older version and understand the risks.

## Frontend (UI) Environment Variables

These variables are used by the Skyvern UI (`skyvern-ui` service):

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | Yes | `http://skyvern:8000/api/v1` | Backend API URL |
| `VITE_WSS_BASE_URL` | Yes | `ws://skyvern:8000/api/v1` | Backend WebSocket URL |
| `VITE_ARTIFACT_API_BASE_URL` | Yes | `http://skyvern:9090` | Artifact server URL |
| `VITE_SKYVERN_API_KEY` | No | `skyvern_...` | API key (auto-read from secrets) |
| `VITE_ENABLE_CODE_BLOCK` | No | `true` | Enable code block features |

**For Coolify with Custom Domains:**
```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_WSS_BASE_URL=wss://api.yourdomain.com/api/v1
VITE_ARTIFACT_API_BASE_URL=https://artifacts.yourdomain.com
```

**For Coolify without Custom Domains (internal network):**
```bash
VITE_API_BASE_URL=http://skyvern:8000/api/v1
VITE_WSS_BASE_URL=ws://skyvern:8000/api/v1
VITE_ARTIFACT_API_BASE_URL=http://skyvern:9090
```

## Example Configurations

### Minimal Configuration (OpenAI)

```bash
DATABASE_STRING=postgresql+psycopg://skyvern:skyvern@postgres:5432/skyvern
BROWSER_TYPE=chromium-headless
ENABLE_OPENAI=true
OPENAI_API_KEY=sk-proj-your-key
LLM_KEY=OPENAI_GPT4O
```

### Production Configuration (Anthropic + Custom Domain)

```bash
# Environment
ENV=production
PORT=8000
LOG_LEVEL=INFO

# Database
DATABASE_STRING=postgresql+psycopg://skyvern:secure_password@postgres:5432/skyvern

# LLM
ENABLE_ANTHROPIC=true
ANTHROPIC_API_KEY=sk-ant-your-key
LLM_KEY=ANTHROPIC_CLAUDE3.5_SONNET
SECONDARY_LLM_KEY=ANTHROPIC_CLAUDE3_HAIKU

# Browser
BROWSER_TYPE=chromium-headless
BROWSER_ACTION_TIMEOUT_MS=10000
MAX_SCRAPING_RETRIES=3

# Storage
VIDEO_PATH=/data/videos
HAR_PATH=/data/har
LOG_PATH=/data/log
ARTIFACT_STORAGE_PATH=/data/artifacts
ENABLE_LOG_ARTIFACTS=true

# Agent
MAX_STEPS_PER_RUN=100
ENABLE_CODE_BLOCK=true

# Analytics
ANALYTICS_ID=production-instance-1
```

### Self-Hosted Configuration (Ollama + Bitwarden)

```bash
# Database
DATABASE_STRING=postgresql+psycopg://skyvern:password@postgres:5432/skyvern

# LLM (Self-hosted Ollama)
ENABLE_OLLAMA=true
LLM_KEY=OLLAMA
OLLAMA_MODEL=qwen2.5:7b-instruct
OLLAMA_SERVER_URL=http://ollama:11434
LLM_CONFIG_MAX_TOKENS=128000

# Browser
BROWSER_TYPE=chromium-headless
MAX_SCRAPING_RETRIES=3

# Bitwarden Integration
SKYVERN_AUTH_BITWARDEN_ORGANIZATION_ID=your-org-id
SKYVERN_AUTH_BITWARDEN_CLIENT_ID=user.your-client-id
SKYVERN_AUTH_BITWARDEN_CLIENT_SECRET=your-secret
SKYVERN_AUTH_BITWARDEN_MASTER_PASSWORD=your-password
BITWARDEN_SERVER=http://bitwarden-cli
BITWARDEN_SERVER_PORT=8087
```

## Environment Variable Priority

Skyvern reads environment variables in the following order (later sources override earlier ones):

1. Default values in code
2. `.env` file in the working directory
3. Environment variables passed to Docker container
4. Environment variables set in Coolify

**Recommendation:** For Coolify, set all variables directly in Coolify's environment variable UI rather than using a `.env` file.

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use strong passwords** for database connections
3. **Rotate API keys** regularly
4. **Use Coolify's secret management** for sensitive values
5. **Limit database permissions** to only what Skyvern needs
6. **Use HTTPS/WSS** for all external connections
7. **Monitor access logs** for suspicious activity

## Troubleshooting

### LLM not working
- Verify the LLM provider is enabled (`ENABLE_[PROVIDER]=true`)
- Check that the API key is valid and has sufficient credits
- Ensure `LLM_KEY` matches an enabled provider's model
- Check API base URL if using custom endpoints

### Database connection errors
- Verify `DATABASE_STRING` format is correct
- Check that PostgreSQL service is running
- Ensure network connectivity between services in Coolify
- Verify database user has necessary permissions

### Storage errors
- Check that volume mounts are configured in Coolify
- Verify directory permissions inside the container
- Ensure paths in environment variables match volume mounts

## Getting Help

- **Skyvern Documentation**: https://docs.skyvern.com
- **Skyvern GitHub**: https://github.com/Skyvern-AI/skyvern
- **Coolify Documentation**: https://coolify.io/docs
- **Coolify Discord**: https://coolify.io/discord
