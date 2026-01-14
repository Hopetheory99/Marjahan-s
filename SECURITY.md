# Security Policy & Authentication Implementation

## Overview

This document outlines security improvements implemented in Phase 1 and provides guidance for production deployment.

### Critical Security Fixes Implemented ✅

#### 1. Server-Backed JWT Authentication ✅

- Moved from client-side sessionStorage to server JWT tokens
- Access tokens (15 min expiry) stored in memory
- Refresh tokens (7 day expiry) in httpOnly cookies (not accessible to JavaScript)
- Automatic token refresh on 401 responses
- Eliminates trivial bypass via DevTools

**Files**: `server/auth.js`, `context/AuthContext.tsx`, `services/apiClient.ts`

#### 2. Input Validation ✅

- Zod schemas for all API payloads (products, orders, auth)
- Server-side validation on POST/PUT endpoints
- Structured error responses (400 with field errors)
- Type-safe contracts between frontend and backend

**Files**: `server/schemas.js`, `server/middleware.js`

#### 3. Role-Based Access Control (RBAC) ✅

- Server-enforced role validation via `requireAdmin` middleware
- Admin endpoints protected at router level
- Token contains role information

**Protected Endpoints**:

- POST `/api/products` - Admin only
- PUT `/api/products/:id` - Admin only
- DELETE `/api/products/:id` - Admin only
- GET `/api/orders` - Admin only
- PUT `/api/orders/:id/status` - Admin only

#### 4. Centralized API Client ✅

- Single axios instance with request/response interceptors
- Automatic token injection via Authorization header
- Consistent error handling across all services
- Easier to debug and test

**File**: `services/apiClient.ts`

#### 5. Structured Logging ✅

- JSON-formatted logs with timestamp, level, metadata
- Ready for Sentry/ELK integration
- Logs include: user action, resource ID, error context

**File**: `server/logger.js`

#### 6. Global Error Handling ✅

- `asyncHandler` wrapper catches all async errors
- Consistent 500 response format
- Full error context for debugging

#### 7. CORS Hardening ✅

- Explicit origin whitelist (localhost during dev)
- Credential support for cookie-based auth
- SameSite=strict for CSRF protection

## Remaining Security Tasks (Phase 2)

### High Priority

- [ ] Implement password hashing (bcrypt)
- [ ] Add rate limiting on `/api/auth/login` (prevent brute force)
- [ ] Enable TypeScript strict mode in services
- [ ] Add input sanitization for user-supplied data
- [ ] Implement request signing for sensitive operations

### Medium Priority

- [ ] Sentry integration for error tracking
- [ ] Security headers (CSP, X-Frame-Options, etc.)
- [ ] Automated OWASP scanning in CI
- [ ] Database encryption at rest
- [ ] Audit logging for admin actions

### Lower Priority

- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 provider integration
- [ ] API key management for service accounts
- [ ] DDoS protection (WAF)

## Environment Configuration

### Required Server Environment Variables

```env
# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your-super-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production

# Admin Credentials (change from default in production!)
ADMIN_PASSWORD=admin123

# Security Settings
NODE_ENV=development  # Set to 'production' for HTTPS cookies
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Required Client Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Testing Authentication

### Manual Test: Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}' \
  -c cookies.txt

# Response:
# {
#   "ok": true,
#   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "role": "admin"
# }
```

### Manual Test: Protected Endpoint

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:3001/api/orders \
  -H "Authorization: Bearer $TOKEN"

# Response: [{ "id": "...", "status": "Pending", ... }]
```

### Manual Test: Invalid Token

```bash
curl -X GET http://localhost:3001/api/orders \
  -H "Authorization: Bearer invalid-token"

# Response: 401 { "message": "Invalid or expired token" }
```

### Automated Tests

```bash
npm run test
# Includes: AuthContext.test.ts, orderService.test.ts
```

## Production Deployment Checklist

- [ ] Generate strong JWT secrets (not in code)
- [ ] Change `ADMIN_PASSWORD` from 'admin123'
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Update `CORS_ORIGIN` to production domain
- [ ] Set up Sentry DSN for error tracking
- [ ] Enable rate limiting on auth endpoints
- [ ] Configure database for order persistence (Phase 2)
- [ ] Set up automated backups
- [ ] Enable audit logging
- [ ] Run security scanner (OWASP/Snyk)
- [ ] Perform penetration testing

## Security Disclosure

If you discover a security vulnerability, please email **security@example.com** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Your contact information

Please do not open public issues for security vulnerabilities.

## Compliance Status

| Standard     | Status           | Notes                                                |
| ------------ | ---------------- | ---------------------------------------------------- |
| OWASP Top 10 | 🟡 In Progress   | Auth/Validation complete; encryption/logging pending |
| PCI DSS      | 🔴 Not Compliant | Real Stripe integration needed (Phase 2)             |
| GDPR         | 🟡 In Progress   | Need data export/deletion endpoints                  |
| SOC 2        | 🔴 Not Certified | Audit logging and monitoring pending                 |

## References

- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8949)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JSON Web Token (JWT) RFC 7519](https://tools.ietf.org/html/rfc7519)
