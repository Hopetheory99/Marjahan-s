# DEVELOPMENT QUICK START GUIDE

## Prerequisites
- Node.js >= 18
- npm >= 9

## One-Command Setup

```bash
# Clone and install everything
git clone <repo>
cd Marjahan-s
npm install
cd server && npm install && cd ..

# Start both in parallel
# Terminal 1:
npm run dev

# Terminal 2:
cd server && npm start
```

## Environment Setup

### Backend (.env in server/)
```bash
cd server
cat > .env << 'EOF'
JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production
ADMIN_PASSWORD=admin123
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
EOF
```

### Frontend (.env.local)
```bash
cat > .env.local << 'EOF'
VITE_API_BASE_URL=http://localhost:3001
EOF
```

## Common Commands

### Development
```bash
# Start frontend dev server (port 5173)
npm run dev

# Start backend (port 3001)
cd server && npm start

# Run tests
npm run test

# Watch tests
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Testing API

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'

# Get access token from response, then:

# Test protected endpoint
curl -X GET http://localhost:3001/api/orders \
  -H "Authorization: Bearer <token>"
```

### Building for Production

```bash
# Frontend
npm run build  # Creates dist/

# Test production build locally
npm run preview

# Backend (just requires Node.js runtime)
# Set NODE_ENV=production and start with: npm start
```

## Project Structure at a Glance

```
Marjahan-s/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/         # Reusable UI components
│   ├── context/            # Global state (Auth, Cart, Toast)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components (routed)
│   ├── services/           # API client & business logic
│   ├── App.tsx             # Main app component
│   └── index.tsx           # Entry point
├── server/                 # Backend (Express.js)
│   ├── index.js            # Main server file
│   ├── auth.js             # JWT utilities
│   ├── config.js           # Configuration
│   ├── logger.js           # Logging
│   ├── schemas.js          # Validation schemas
│   ├── middleware.js       # Express middleware
│   └── data/               # JSON data files (dev only)
├── e2e/                    # E2E tests (Playwright)
├── package.json            # Frontend dependencies
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite config
```

## Architecture Decisions

### Frontend-Backend Communication
- ✅ Uses centralized API client (`services/apiClient.ts`)
- ✅ All requests go through axios interceptors
- ✅ Automatic token injection in Authorization header
- ✅ Automatic token refresh on 401

### Authentication Flow
1. User logs in via `POST /api/auth/login`
2. Server returns JWT access token (15 min) + refresh token
3. Refresh token stored in httpOnly cookie (browser sends automatically)
4. Access token stored in React state (memory)
5. For protected requests, access token injected via interceptor
6. On 401, interceptor calls `/api/auth/refresh` to get new access token

### State Management
- **Auth**: Context API (`AuthContext.tsx`) - global, persisted via server
- **Cart**: Context API + useReducer (`CartContext.tsx`) - persisted in localStorage
- **Toast**: Context API (`ToastContext.tsx`) - ephemeral notifications
- **Async Data**: React Query (`useProducts`, `useOrders` hooks)

### Error Handling Strategy
1. Server: Global `asyncHandler` wrapper catches all errors
2. Frontend: Services throw errors, caught by React Query
3. UI: Error boundaries display fallback UI
4. Logging: All errors logged with context

## Testing Philosophy

### Unit Tests
- Located in `__tests__` folders next to source files
- Test business logic, reducers, utilities in isolation
- Use Vitest + React Testing Library

### E2E Tests
- Located in `e2e/` directory
- Test complete user flows (login → checkout → confirmation)
- Use Playwright

### Running Tests
```bash
# All tests
npm run test

# Watch mode
npm run test:watch

# Specific file
npm run test -- cartReducer.test.ts

# E2E tests
npm run e2e
```

## Common Development Tasks

### Add a New API Endpoint

1. Add validation schema in `server/schemas.js`:
```javascript
const newResourceSchema = z.object({
  name: z.string().min(1),
  value: z.number().positive()
});
```

2. Add route in `server/index.js`:
```javascript
app.post('/api/resource',
  authenticateRequest,  // Add if auth required
  validate(newResourceSchema),
  asyncHandler(async (req, res) => {
    const { name, value } = req.validatedData;
    // Implementation...
    res.json({ success: true });
  })
);
```

3. Create service method in `services/resourceService.ts`:
```typescript
export const resourceService = {
  create: async (data: any) => {
    const res = await apiClient.post('/api/resource', data);
    return res.data;
  }
};
```

4. Use in component:
```typescript
const handleCreate = async (formData) => {
  try {
    const result = await resourceService.create(formData);
    addToast('Created successfully', 'success');
  } catch (error) {
    addToast(error.message, 'error');
  }
};
```

### Add a New Protected Route

1. Create page component in `pages/MyPage.tsx`
2. Add route in `App.tsx`:
```tsx
<Route 
  path="/my-route" 
  element={
    <ProtectedRoute>
      <AdminLayout>
        <MyPage />
      </AdminLayout>
    </ProtectedRoute>
  } 
/>
```

### Add Tests

1. Create file next to component: `components/__tests__/MyComponent.test.tsx`
2. Test logic in isolation:
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});
```

## Debugging Tips

### Frontend
- Open DevTools (F12)
- Check Network tab for API requests
- Check Console for errors
- Check Storage for cookies/localStorage

### Backend
- Check terminal logs (structured JSON format)
- Add console.log() wrapped with logger calls:
```javascript
logger.debug('Processing order', { orderId, customerId });
```
- Use `npm run dev` to see real-time logs

### API Debugging
- Use Postman/Insomnia to test endpoints
- Include Bearer token in Authorization header
- Check response structure matches schema

## Performance Checklist

Before committing:
- [ ] `npm run lint` passes
- [ ] `npm run format` applied
- [ ] `npm run test` passes
- [ ] No console errors/warnings
- [ ] TypeScript compilation successful

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors with strict mode
- Check that all function return types are annotated
- Ensure null/undefined handled properly
- No implicit `any` types

### API calls returning 401
- Check token is being sent: DevTools Network tab → Authorization header
- Check token hasn't expired (15 min)
- Try logging out and back in

### CORS errors
- Ensure `CORS_ORIGIN` in server .env includes your frontend URL
- Check that frontend and backend are running on different ports

## Environment Variables Reference

### Backend (server/.env)
| Variable | Default | Description |
|----------|---------|-------------|
| JWT_SECRET | N/A | Secret for signing tokens (required) |
| JWT_REFRESH_SECRET | N/A | Secret for refresh tokens (required) |
| ADMIN_PASSWORD | admin123 | Admin login password (change in prod!) |
| NODE_ENV | development | Environment: development or production |
| CORS_ORIGIN | localhost | Comma-separated origins allowed |
| PORT | 3001 | Server port |

### Frontend (.env.local)
| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_BASE_URL | http://localhost:3001 | Backend API URL |

## Resources

- [TypeScript Docs](https://www.typescriptlang.org/)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Express.js](https://expressjs.com/)
- [Zod Validation](https://zod.dev/)
- [JWT Introduction](https://jwt.io/introduction)
- [Vitest Documentation](https://vitest.dev/)
