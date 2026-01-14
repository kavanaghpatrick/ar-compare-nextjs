# Contributing to AR Compare

Thank you for your interest in contributing to AR Compare! This document provides guidelines and instructions for contributing.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ar-compare-nextjs.git
   cd ar-compare-nextjs
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm test       # Run tests
pnpm lint       # Run ESLint
```

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-wishlist`)
- `fix/` - Bug fixes (e.g., `fix/comparison-cart-overflow`)
- `docs/` - Documentation changes (e.g., `docs/update-api-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/product-card-component`)
- `test/` - Test additions/changes (e.g., `test/add-filter-tests`)

### Commit Messages

Write clear, concise commit messages:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples:**
```
feat: Add product wishlist functionality

fix: Resolve comparison cart z-index issue on mobile

docs: Update API endpoint documentation
```

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces (avoid `any`)
- Export types from `types/` directory when reusable

### React Components

- Use functional components with hooks
- Place components in `components/` directory
- Use named exports for components
- Include proper TypeScript props interfaces

```tsx
interface ProductCardProps {
  product: Product;
  onCompare?: (id: string) => void;
}

export function ProductCard({ product, onCompare }: ProductCardProps) {
  // ...
}
```

### CSS/Styling

- Use Tailwind CSS utilities
- For complex styles, use CSS modules or `styles/` directory
- Follow the z-index scale defined in `globals.css`

### Accessibility

- Include proper ARIA attributes
- Ensure keyboard navigation works
- Maintain color contrast ratios (WCAG AA)
- Add `aria-live` regions for dynamic content

## Testing

### Running Tests

```bash
pnpm test              # Run all tests
pnpm test -- --watch   # Watch mode
pnpm test -- path/to/test.ts  # Run specific test
```

### Writing Tests

- Place tests in `__tests__/` directory
- Mirror the source file structure
- Use descriptive test names

```typescript
describe('ProductCard', () => {
  it('should display product name and price', () => {
    // ...
  });
});
```

## Pull Request Process

1. **Before submitting:**
   - Run `pnpm lint` and fix any issues
   - Run `pnpm test` and ensure all tests pass
   - Run `pnpm build` to verify the build works

2. **PR description should include:**
   - Summary of changes
   - Related issue number (if applicable)
   - Screenshots for UI changes
   - Testing steps

3. **PR checklist:**
   - [ ] Code follows project style guidelines
   - [ ] Tests added/updated for changes
   - [ ] Documentation updated if needed
   - [ ] No console.log statements in production code
   - [ ] Accessibility considerations addressed

## Project Structure

```
ar-compare-nextjs/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── blog/           # Blog pages
│   ├── products/       # Product pages
│   └── ...
├── components/          # React components
│   ├── ui/             # Shadcn/UI components
│   └── ...
├── contexts/           # React contexts
├── data/               # Static data
├── docs/               # Documentation
├── hooks/              # Custom hooks
├── lib/                # Utilities
├── styles/             # CSS files
├── types/              # TypeScript types
└── __tests__/          # Test files
```

## Questions?

If you have questions, please:
1. Check existing issues and documentation
2. Open a new issue with the `question` label

Thank you for contributing!
