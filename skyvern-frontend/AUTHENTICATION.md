# Frontend UI Authentication

A simple username/password authentication layer for the Skyvern UI that can be configured via environment variables.

## Features

- ✅ Simple username/password authentication
- ✅ Session-based (24-hour timeout)
- ✅ Configurable via environment variables
- ✅ Can be completely disabled
- ✅ Logout button when enabled
- ✅ No backend changes required

## Configuration

### Enable Authentication

Add these environment variables to your frontend `.env` file:

```bash
# Enable UI authentication
VITE_UI_AUTH_ENABLED=true

# Set credentials (change these!)
VITE_UI_AUTH_USERNAME=admin
VITE_UI_AUTH_PASSWORD=your-secure-password-here
```

### Disable Authentication (Default)

```bash
# Disable authentication (or omit the variable)
VITE_UI_AUTH_ENABLED=false
```

## Usage

### For Docker Compose

Add to your `docker-compose.yml` under the `skyvern-ui` service:

```yaml
skyvern-ui:
  image: public.ecr.aws/skyvern/skyvern-ui:latest
  environment:
    # ... other variables ...
    - VITE_UI_AUTH_ENABLED=true
    - VITE_UI_AUTH_USERNAME=admin
    - VITE_UI_AUTH_PASSWORD=SecurePassword123!
```

### For Coolify

In your Coolify frontend service environment variables:

```bash
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=admin
VITE_UI_AUTH_PASSWORD=SecurePassword123!
```

### For Local Development

Create or edit `skyvern-frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_WSS_BASE_URL=ws://localhost:8000/api/v1
VITE_ARTIFACT_API_BASE_URL=http://localhost:9090
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=admin
VITE_UI_AUTH_PASSWORD=admin
```

## How It Works

1. **Login Required**: When a user visits the UI, they see a login form
2. **Credentials Check**: Username and password are checked against environment variables
3. **Session Storage**: Upon successful login, authentication is stored in browser session storage
4. **24-Hour Timeout**: Session expires after 24 hours
5. **Logout**: Users can logout using the button in the top-right corner

## Security Notes

### ⚠️ Important Security Considerations

This is a **basic authentication layer** suitable for:
- Internal deployments
- Development environments
- Small teams
- Adding a simple access barrier

This is **NOT** suitable for:
- Production systems with sensitive data
- Multi-user environments requiring user tracking
- Systems requiring audit logs
- High-security requirements

### Limitations

1. **Client-Side Only**: Authentication happens in the browser (no backend validation)
2. **Shared Credentials**: All users share the same username/password
3. **Session Storage**: Sessions are stored in browser (cleared when tab closes)
4. **No Encryption**: Credentials are in plain text in environment variables
5. **No Rate Limiting**: No protection against brute force attacks

### Recommendations

For production systems, consider:
- Implementing proper backend authentication with JWT tokens
- Using OAuth2/OIDC providers (Google, GitHub, etc.)
- Adding rate limiting and IP blocking
- Using a secrets manager for credentials
- Implementing role-based access control (RBAC)
- Adding audit logging

## Troubleshooting

### Issue: Login Form Not Showing

**Check:**
1. Is `VITE_UI_AUTH_ENABLED` set to `true`?
2. Did you restart the frontend after changing environment variables?
3. Clear your browser cache and session storage

### Issue: Invalid Credentials Error

**Check:**
1. Verify the username matches `VITE_UI_AUTH_USERNAME` exactly
2. Verify the password matches `VITE_UI_AUTH_PASSWORD` exactly
3. Check for extra spaces in environment variables
4. Credentials are case-sensitive

### Issue: Session Keeps Expiring

**Cause:** Session expires after 24 hours or when browser tab is closed

**Solutions:**
1. This is by design for security
2. To modify timeout, edit `AuthGuard.tsx` line 10:
   ```typescript
   const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // Change this value
   ```

### Issue: Logout Button Not Visible

**Check:**
1. Make sure `VITE_UI_AUTH_ENABLED=true`
2. The button appears in the top-right corner (fixed position)
3. Check if it's hidden behind other UI elements

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_UI_AUTH_ENABLED` | No | `false` | Enable/disable authentication |
| `VITE_UI_AUTH_USERNAME` | No | `admin` | Login username |
| `VITE_UI_AUTH_PASSWORD` | No | `admin` | Login password |

## Example Configurations

### Disabled (Default)
```bash
# No auth variables needed, or explicitly disable:
VITE_UI_AUTH_ENABLED=false
```

### Basic Internal Use
```bash
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=skyvern
VITE_UI_AUTH_PASSWORD=MySecurePass123!
```

### Development
```bash
VITE_UI_AUTH_ENABLED=true
VITE_UI_AUTH_USERNAME=dev
VITE_UI_AUTH_PASSWORD=dev
```

## Customization

### Change Session Timeout

Edit `skyvern-frontend/src/components/AuthGuard.tsx`:

```typescript
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 hours
```

### Customize Login UI

The login form is in `AuthGuard.tsx`. You can modify:
- Colors and styling (Tailwind classes)
- Logo and branding
- Form fields
- Error messages

### Add Multiple Users

To support multiple users, you'll need to:
1. Store users in backend database
2. Create backend API for authentication
3. Use JWT tokens instead of session storage
4. Update `AuthGuard.tsx` to call backend API

Example backend endpoint (pseudo-code):
```python
@router.post("/auth/login")
async def login(credentials: LoginCredentials):
    user = await db.get_user(credentials.username)
    if user and verify_password(credentials.password, user.hashed_password):
        token = create_jwt_token(user.id)
        return {"token": token}
    raise HTTPException(401, "Invalid credentials")
```

## Testing

### Test Authentication Enabled
```bash
# Set environment variables
export VITE_UI_AUTH_ENABLED=true
export VITE_UI_AUTH_USERNAME=testuser
export VITE_UI_AUTH_PASSWORD=testpass

# Start frontend
npm run dev

# Visit http://localhost:5173
# Should see login form
# Enter: testuser / testpass
# Should gain access
```

### Test Authentication Disabled
```bash
# Unset or set to false
export VITE_UI_AUTH_ENABLED=false

# Start frontend
npm run dev

# Visit http://localhost:5173
# Should go directly to dashboard (no login form)
```

## Migration from No Auth to Auth

If you're adding authentication to an existing deployment:

1. **Prepare**: Choose a strong password
2. **Update Environment**: Add the three `VITE_UI_AUTH_*` variables
3. **Rebuild**: Run `npm run build` (or let Docker rebuild)
4. **Deploy**: Restart the frontend service
5. **Verify**: Access the UI and confirm login works
6. **Notify Users**: Inform your team of the new credentials

## Rollback

To remove authentication:

1. Set `VITE_UI_AUTH_ENABLED=false` or remove the variable
2. Restart frontend service
3. Clear browser cache/session storage

No code changes needed - just environment variable configuration!

