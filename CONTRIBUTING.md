# Contributing to Marjahan's Jewelry

Thank you for your interest in contributing to Marjahan's Jewelry! This document provides guidelines for contributing.

## 🛠️ Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Marjahan-s.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Copy `.env.example` to `.env.local` and add your Supabase credentials

## 📝 Code Style

- **TypeScript**: Use strict types, avoid `any`
- **Components**: Use functional components with React.FC
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Formatting**: Run Prettier before committing

## 🏗️ Architecture Guidelines

### Components

- Place reusable components in `/components`
- Use `React.memo` for pure components
- Add proper ARIA labels for accessibility

### Context

- Keep contexts focused and single-purpose
- Use `useCallback` and `useMemo` to prevent unnecessary re-renders

### Services

- All API calls go through `/services`
- Simulate delays for testing loading states

## 🧪 Testing

- Unit tests for critical business logic (cart calculations)
- Integration tests for user flows
- E2E tests for checkout flow

```bash
npm test              # Unit tests
npx playwright test   # E2E tests
```

## 📦 Pull Request Process

1. Update tests if needed
2. Ensure no lint errors
3. Update documentation if adding features
4. Request review from maintainers

## 🔒 Security

Never commit:

- API keys or secrets
- `.env` or `.env.local` files
- User data

---

Questions? Open an issue or reach out to the maintainers.
