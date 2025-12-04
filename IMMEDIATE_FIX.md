# ⚡ Immediate Fixes for CORS and Auth

## 🚨 Problem 1: CORS Error

**Error Message:**
```
Access to XMLHttpRequest blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
```

**This is NOT related to the auth feature!** It's a backend configuration issue.

### ✅ Fix: Add to Backend Environment (Coolify)

```bash
ALLOWED_ORIGINS=https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com
```

**Steps:**
1. Go to Coolify → Your Backend Service
2. Click "Environment Variables"
3. Add: `ALLOWED_ORIGINS=https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com`
4. Save
5. Restart backend service
6. Clear browser cache

**Alternative (allow all origins - less secure):**
```bash
ALLOWED_ORIGINS=*
```

---

## 🚨 Problem 2: Auth Login Not Showing

**Why it's not showing:**
- The environment variable `VITE_UI_AUTH_ENABLED` must be set to `"true"` (string)
- Frontend needs to be **rebuilt** after adding environment variables
- Environment variables are baked into the build at build time

### ✅ Fix: Add to Frontend Environment (Coolify)

```bash
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=admin
VITE_UI_AUTH_PASSWORD=YourSecurePassword123!
```

**Steps:**
1. Go to Coolify → Your Frontend Service
2. Click "Environment Variables"
3. Add the three variables above
4. Save
5. **Restart frontend service** (this triggers a rebuild)
6. Wait for service to be "Running"
7. Clear browser cache (Ctrl+Shift+R)

**Important:** The value must be the **string** `"true"`, not `1` or `yes`.

---

## 🧪 Verify It's Working

### Test CORS:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to load the UI
4. API calls should succeed (no CORS errors)

### Test Auth:
1. Visit your UI: https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com
2. You should see a **login form** (not the dashboard)
3. Enter username and password
4. You should be able to access the dashboard

### Debug Auth (if still not showing):
1. Open browser console (F12)
2. Look for: `[AuthGuard] Configuration:`
3. Check if `AUTH_ENABLED` is `true`
4. If it's `false`, the environment variable isn't set correctly

---

## 📋 Complete Environment Variables Checklist

### Backend Service:
```bash
# CORS Fix
ALLOWED_ORIGINS=https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com

# Your existing variables...
BROWSER_TYPE=chromium-headless
LLM_KEY=OPENAI_GPT4O
# ... etc
```

### Frontend Service:
```bash
# Auth Configuration
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=admin
VITE_UI_AUTH_PASSWORD=YourSecurePassword123!

# Your existing variables...
VITE_API_BASE_URL=https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com/api/v1
VITE_WSS_BASE_URL=wss://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com/api/v1
VITE_ARTIFACT_API_BASE_URL=https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com:9090
```

---

## 🎯 Quick Summary

| Issue | Fix | Where |
|-------|-----|-------|
| CORS Error | Add `ALLOWED_ORIGINS` | Backend environment |
| Auth Not Showing | Add `VITE_UI_AUTH_ENABLED=true` | Frontend environment + rebuild |

**Both are simple environment variable fixes!** 🎉

---

## 🆘 Still Not Working?

### CORS Still Failing:
1. Check backend logs for CORS errors
2. Verify `ALLOWED_ORIGINS` is set correctly (no typos)
3. Try `ALLOWED_ORIGINS=*` temporarily to test
4. Check if there's a reverse proxy (nginx/traefik) that might be blocking

### Auth Still Not Showing:
1. Check browser console for `[AuthGuard] Configuration:` log
2. Verify `VITE_UI_AUTH_ENABLED` is exactly `"true"` (string)
3. Make sure frontend service was **restarted** (not just saved)
4. Clear browser storage: DevTools → Application → Clear Storage
5. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

See `CORS_AND_AUTH_FIX.md` for detailed troubleshooting!

