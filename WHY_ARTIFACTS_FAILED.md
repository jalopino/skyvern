# Why Artifacts and Streaming Failed - Technical Explanation

## Overview

Skyvern's architecture has **three main components** that need to communicate:

```
┌─────────────┐     WebSocket      ┌─────────────┐
│             │ ←────────────────→ │             │
│  Frontend   │                    │   Backend   │
│  (React)    │     REST API       │  (FastAPI)  │
│             │ ←────────────────→ │             │
└─────────────┘                    └─────────────┘
       ↓                                   ↓
       │ HTTP                              │ File I/O
       │ GET                               │ Write
       ↓                                   ↓
┌─────────────────────────────────────────────┐
│        Artifact Server (Node.js)            │
│             Port 9090                       │
│   Serves: videos, screenshots, logs, etc.   │
└─────────────────────────────────────────────┘
```

## What Was Missing

### 1. Environment Variables Not Set

The frontend React application needs to know:
- **Where is the backend API?** → `VITE_API_BASE_URL`
- **Where is the WebSocket endpoint?** → `VITE_WSS_BASE_URL`  
- **Where is the artifact server?** → `VITE_ARTIFACT_API_BASE_URL`

Without these, the frontend couldn't:
- ❌ Connect to WebSocket for live streaming
- ❌ Fetch artifacts (screenshots, videos, logs)
- ❌ Display real-time browser activity

### 2. Artifact Server Configuration

The artifact server (`artifactServer.js`) needs to:
- Run on port 9090
- Serve files from the local filesystem
- Support video streaming with range requests
- Handle CORS for browser access

**How it works:**
```javascript
// Frontend requests artifact
GET http://localhost:9090/artifact/image?path=/data/artifacts/screenshot.png

// Artifact server reads file and returns it
fs.readFile(path) → Response
```

### 3. WebSocket Streaming Setup

The backend provides WebSocket endpoints:
- `/stream/vnc/browser_session/{session_id}` - Interactive browser streaming
- `/stream/messages/browser_session/{session_id}` - Control messages
- `/stream/tasks/{task_id}` - Screenshot streaming for tasks
- `/stream/workflow_runs/{run_id}` - Workflow streaming

**How it works:**
```
1. Frontend opens WebSocket connection
2. Backend streams browser updates (screenshots, state changes)
3. Frontend displays in real-time
4. User can interact with the browser via messages
```

## How the Fix Works

### Backend `.env`
```bash
# Tells backend where to store files
ARTIFACT_STORAGE_PATH=/data/artifacts
VIDEO_PATH=/data/videos

# Enables browser automation
BROWSER_TYPE=chromium-headful

# Required: LLM for AI agent
ENABLE_OPENAI=true
OPENAI_API_KEY=sk-...
LLM_KEY=OPENAI_GPT4O
```

### Frontend `.env`
```bash
# Tells frontend where backend is
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Tells frontend where WebSocket is
VITE_WSS_BASE_URL=ws://localhost:8000/api/v1

# Tells frontend where artifact server is  
VITE_ARTIFACT_API_BASE_URL=http://localhost:9090
```

### Artifact Server Startup
```bash
# In package.json:
"start": "npm run serve & npm run run-artifact-server"

# This runs:
# 1. npm run serve → Serves built React app (port 8080)
# 2. npm run run-artifact-server → Starts artifact server (port 9090)
```

## Data Flow Examples

### Viewing a Screenshot Artifact

```
1. User clicks on a task in UI
   └→ Frontend: GET /api/v1/step/{step_id}/artifacts

2. Backend returns artifact metadata:
   └→ {artifact_id: "123", uri: "file:///data/artifacts/screenshot.png"}

3. Frontend requests actual file:
   └→ GET http://localhost:9090/artifact/image?path=/data/artifacts/screenshot.png

4. Artifact server reads file and returns it:
   └→ fs.readFileSync(path) → Response with image data

5. Frontend displays image in UI
```

### Live Browser Streaming

```
1. User starts a task with browser session
   └→ POST /api/v1/runs

2. Backend creates browser session:
   └→ Launches Chrome, starts VNC server

3. Frontend opens WebSocket:
   └→ ws://localhost:8000/api/v1/stream/vnc/browser_session/{session_id}

4. Backend streams browser updates:
   └→ Captures screen via VNC → Encodes to base64 → Sends via WebSocket

5. Frontend receives and displays:
   └→ Decodes base64 → Draws to canvas → Updates in real-time

6. User interacts:
   └→ Click on canvas → Send click coordinates via WebSocket → Backend clicks in browser
```

## Why Docker Compose Configuration Matters

In `docker-compose.yml`:

```yaml
skyvern:
  expose:
    - 8000   # Main API
    - 9090   # Artifact/Streaming server ← MUST expose this!
    - 9222   # CDP browser debugging
```

The frontend container needs access to port 9090 on the backend container:

```yaml
skyvern-ui:
  environment:
    # Points to backend container (not localhost)
    - VITE_ARTIFACT_API_BASE_URL=http://skyvern:9090  # ← Container name, not localhost
```

## Common Misconceptions

### ❌ "Artifacts are served by the backend API"
**Reality:** Artifacts are served by a separate Node.js server on port 9090

### ❌ "WebSocket streaming is a separate service"
**Reality:** WebSocket endpoints are part of the main FastAPI backend on port 8000

### ❌ "I can skip the artifact server if I don't use recordings"
**Reality:** The artifact server serves ALL artifacts: screenshots, logs, LLM requests, etc.

### ❌ "Environment variables are optional"
**Reality:** Without proper environment variables, the frontend can't find the backend or artifacts

## File System Structure

When Skyvern runs:

```
/data/
├── artifacts/           ← ARTIFACT_STORAGE_PATH
│   ├── {task_id}/
│   │   ├── {step_id}/
│   │   │   ├── screenshot_before.png
│   │   │   ├── screenshot_after.png
│   │   │   ├── llm_request.json
│   │   │   ├── llm_response.json
│   │   │   └── elements.json
│   └── recordings/
│       └── {task_id}.mp4
├── videos/              ← VIDEO_PATH
│   └── {recording_id}.mp4
├── har/                 ← HAR_PATH
│   └── {task_id}.har
└── log/                 ← LOG_PATH
    └── {task_id}.log
```

The artifact server (`artifactServer.js`) serves these files:
- `GET /artifact/image?path=/data/artifacts/...` → PNG/JPG files
- `GET /artifact/json?path=/data/artifacts/...` → JSON files
- `GET /artifact/recording?path=/data/videos/...` → MP4 videos (with range support)
- `GET /artifact/text?path=/data/log/...` → Text/log files

## Security Considerations

The artifact server serves files from the local filesystem. In production:

1. **Restrict access:** Only serve files from allowed directories
2. **Validate paths:** Prevent path traversal attacks (`../../../etc/passwd`)
3. **Authenticate:** Require API key for artifact access
4. **Use cloud storage:** Consider S3 instead of local files for production

Current implementation (development only):
```javascript
// artifactServer.js
app.get("/artifact/image", (req, res) => {
  const path = req.query.path;  // ← No validation! Dev only!
  res.sendFile(path);
});
```

For production, Skyvern supports S3:
```bash
SKYVERN_STORAGE_TYPE=s3
AWS_S3_BUCKET_ARTIFACTS=my-bucket
GENERATE_PRESIGNED_URLS=true
```

## Troubleshooting Deep Dive

### WebSocket Fails to Connect

**Check 1:** Is `VITE_WSS_BASE_URL` correct?
```bash
# Should be ws:// for HTTP, wss:// for HTTPS
echo $VITE_WSS_BASE_URL
```

**Check 2:** Can you reach the backend?
```bash
curl http://localhost:8000/api/v1/health
```

**Check 3:** Is authentication working?
```bash
# WebSocket needs API key or token
# Check browser console for: "No valid credential provided"
```

### Artifacts Return 404

**Check 1:** Is artifact server running?
```bash
lsof -i :9090
# Should show: node artifactServer.js
```

**Check 2:** Does the file exist?
```bash
# Check the artifact URI from API
# Example: file:///data/artifacts/screenshot.png
ls -la /data/artifacts/screenshot.png
```

**Check 3:** Is `VITE_ARTIFACT_API_BASE_URL` correct?
```javascript
// Check in browser console:
console.log(import.meta.env.VITE_ARTIFACT_API_BASE_URL)
// Should be: http://localhost:9090
```

### Streaming Shows Black Screen

**Check 1:** Is browser session created?
```bash
# Check API response has browser_session_id
curl http://localhost:8000/api/v1/runs/{run_id}
```

**Check 2:** Is VNC server running?
```bash
# Backend logs should show: "Starting VNC server"
docker compose logs -f skyvern | grep VNC
```

**Check 3:** Is WebSocket receiving data?
```javascript
// Browser console → Network → WS tab
// Should see frames being received
```

## Summary

Artifacts and streaming failed because:
1. ❌ No `.env` files existed
2. ❌ Frontend didn't know backend URLs
3. ❌ Artifact server configuration missing

The fix:
1. ✅ Created backend `.env` with paths and LLM config
2. ✅ Created frontend `.env` with API/WSS/Artifact URLs
3. ✅ Documented how to start artifact server

Now the complete stack works:
```
Frontend ←→ Backend (WebSocket + REST) ←→ Browser Automation
   ↓
Artifact Server (serves files)
```

