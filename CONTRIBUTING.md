<<<<<<< HEAD
=======
<<<<<<< HEAD

>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
# Contributing to Marjahan's Jewelry

Thank you for your interest in contributing! This document provides guidelines for maintaining code quality and consistency.

## 🛠️ Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/Marjahan-s.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Copy `.env.example` to `.env.local` and add your credentials

## 📝 Code Style

- **TypeScript**: Use strict types, avoid `any`
- **Components**: Use functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Formatting**: Prettier and ESLint auto-format on save
- **Commits**: Use conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)

## 🏗️ Architecture Guidelines

### Components
- Place reusable components in `/components`
- Use `React.memo` for pure components when needed
- Add proper ARIA labels for accessibility
- Keep components focused and single-purpose

### Context & State
- Keep contexts focused and single-purpose
- Use `useCallback` and `useMemo` to prevent unnecessary re-renders
- Use React Query for server state

### Services
- All API calls go through `/services`
- Handle errors gracefully with proper fallbacks
- Use TypeScript for type safety

## 🧪 Testing

- Unit tests for critical business logic
- Integration tests for user flows
- E2E tests for checkout and payment flows

```bash
npm test              # Unit/integration tests
npm run test:e2e      # E2E tests
```

## 📦 Pull Request Process

1. Ensure `npm run lint` passes
2. Ensure `npm test` passes
3. Update tests if needed
4. Update documentation for new features
5. Keep PRs small and focused
6. Request review from maintainers

## 🔒 Security

**Never commit:**
- API keys or secrets
- `.env` or `.env.local` files
- Real user data
- Credentials of any kind

Use platform environment variables (Vercel/Netlify/Supabase) for production secrets.

---

<<<<<<< HEAD
Questions? Open an issue or reach out to the maintainers.
=======
# Questions? Open an issue or reach out to the maintainers.

# Contributing

Thanks for your interest in contributing to Marjahan's demo app. This is a trimmed contributing guide with basic expectations.

1. Fork and create a feature branch from `main`.
2. Follow commit message conventions: `feat:`, `fix:`, `chore:`, `docs:`.
3. Run `npm run lint` and `npm run test` before opening a PR.
4. Add tests for any new logic and keep changes focused.
5. Use small PRs and request reviews from maintainers.

Code style is enforced via ESLint and Prettier. Husky runs lint-staged on pre-commit.

> > > > > > > 761b4aa0e334fc8c74177e361cd66e69829c60ff
>>>>>>> 64f6aa027e08ffdbcb5834078bd43140d2930f1a
