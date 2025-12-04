# Fixing CORS Error and Auth Not Showing

## 🚨 Issue #1: CORS Error (NOT related to auth)

**Error:**
```
Access to XMLHttpRequest at 'https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com/api/v1/workflows...' 
from origin 'https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com' 
has been blocked by CORS policy
```

**Root Cause:**
The backend's `ALLOWED_ORIGINS` doesn't include your frontend domain.

**Fix:**

### In Coolify Backend Service, add this environment variable:

```bash
ALLOWED_ORIGINS=https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com
```

**Or allow all origins (less secure, but works):**
```bash
ALLOWED_ORIGINS=*
```

**Multiple origins (comma-separated):**
```bash
ALLOWED_ORIGINS=https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com,https://another-domain.com
```

**After adding:**
1. Restart backend service in Coolify
2. Clear browser cache
3. Try again

---

## 🚨 Issue #2: Auth Login Not Showing

**Root Cause:**
The environment variable `VITE_UI_AUTH_ENABLED` must be the **exact string** `"true"` (not just truthy).

**Current code checks:**
```typescript
const AUTH_ENABLED = import.meta.env.VITE_UI_AUTH_ENABLED === "true";
```

This means:
- ✅ `VITE_UI_AUTH_ENABLED=true` → Works
- ❌ `VITE_UI_AUTH_ENABLED=1` → Doesn't work
- ❌ `VITE_UI_AUTH_ENABLED=yes` → Doesn't work
- ❌ `VITE_UI_AUTH_ENABLED` (not set) → Doesn't work

**Fix:**

### In Coolify Frontend Service, add these environment variables:

```bash
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=admin
VITE_UI_AUTH_PASSWORD=your-password-here
```

**Important Notes:**
1. The value must be the **string** `"true"` (not boolean)
2. After adding, you need to **rebuild** the frontend (environment variables are baked in at build time)
3. In Coolify, this usually means restarting the service will trigger a rebuild

**To verify it's working:**
1. Add the environment variables
2. Restart frontend service in Coolify
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. You should see a login form

---

## 🔧 Complete Fix Steps

### Step 1: Fix CORS (Backend)

**In Coolify → Backend Service → Environment Variables:**

Add:
```bash
ALLOWED_ORIGINS=https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com
```

Save and restart backend service.

### Step 2: Enable Auth (Frontend)

**In Coolify → Frontend Service → Environment Variables:**

Add:
```bash
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=admin
VITE_UI_AUTH_PASSWORD=YourSecurePassword123!
```

**Important:** After adding these, the frontend needs to be **rebuilt**. In Coolify:
1. Save the environment variables
2. Restart the frontend service (this should trigger a rebuild)
3. Wait for the service to be "Running"

### Step 3: Test

1. Clear browser cache
2. Visit: https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com
3. You should see a login form
4. Enter username and password
5. You should be able to access the dashboard

---

## 🐛 Debugging

### If CORS still fails after adding ALLOWED_ORIGINS:

1. **Check backend logs** in Coolify:
   - Look for CORS-related errors
   - Verify the environment variable was set correctly

2. **Test with curl:**
   ```bash
   curl -H "Origin: https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com" \
        -H "Access-Control-Request-Method: GET" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://ngocw80wk4g4cckkg8wcwsgo.eunoiadigitalph.com/api/v1/workflows
   ```
   
   Should return headers like:
   ```
   Access-Control-Allow-Origin: https://ys8k8w44ogo4w4004co804w8.eunoiadigitalph.com
   ```

3. **Check if ALLOWED_ORIGINS is being read:**
   - Backend logs should show CORS configuration on startup
   - Default is `["*"]` if not set, but might be overridden

### If Auth still doesn't show:

1. **Check browser console:**
   ```javascript
   // Open DevTools (F12) → Console tab
   console.log(import.meta.env.VITE_UI_AUTH_ENABLED)
   // Should output: "true"
   ```

2. **Verify environment variable format:**
   - Must be exactly: `VITE_UI_AUTH_ENABLED=true`
   - Not: `VITE_UI_AUTH_ENABLED=1` or `VITE_UI_AUTH_ENABLED=yes`

3. **Check if frontend was rebuilt:**
   - Environment variables are baked into the build
   - Just restarting might not be enough
   - You may need to trigger a rebuild in Coolify

4. **Clear browser storage:**
   - Open DevTools (F12)
   - Application tab → Clear Storage → Clear site data
   - Hard refresh (Ctrl+Shift+R)

---

## 📋 Quick Checklist

### CORS Fix:
- [ ] Added `ALLOWED_ORIGINS` to backend environment
- [ ] Restarted backend service
- [ ] Cleared browser cache
- [ ] Tested API call (should work now)

### Auth Fix:
- [ ] Added `VITE_UI_AUTH_ENABLED=true` to frontend environment
- [ ] Added `VITE_UI_AUTH_USERNAME=admin` to frontend environment
- [ ] Added `VITE_UI_AUTH_PASSWORD=...` to frontend environment
- [ ] Restarted frontend service (triggers rebuild)
- [ ] Cleared browser cache
- [ ] Login form appears ✅

---

## 💡 Why These Issues Happened

### CORS:
- Backend defaults to `ALLOWED_ORIGINS=["*"]` in code
- But if the environment variable is set to something else (or empty), it might not include your frontend domain
- Cross-origin requests require explicit permission

### Auth:
- Vite environment variables are read at **build time**, not runtime
- The check `=== "true"` requires the exact string
- If the variable isn't set or is set incorrectly, auth is disabled
- Frontend needs to be rebuilt after adding environment variables

---

## 🎯 Summary

**CORS Error:** Add `ALLOWED_ORIGINS` to backend environment  
**Auth Not Showing:** Add `VITE_UI_AUTH_ENABLED=true` to frontend environment and rebuild

Both are **environment variable configuration issues**, not code bugs! 🎉

