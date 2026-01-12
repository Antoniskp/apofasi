# Contributing to Apofasi

Thank you for your interest in contributing to Apofasi! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote instance)
- Git

### Initial Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/Antoniskp/apofasi.git
   cd apofasi
   ```

2. **Set up environment variables**
   ```bash
   # Server
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   
   # Client
   cd ../client
   echo "VITE_API_BASE_URL=http://localhost:5000" > .env
   cd ..
   ```

3. **Install dependencies**
   ```bash
   # Server
   cd server
   npm install
   
   # Client
   cd ../client
   npm install
   ```

4. **Start MongoDB**
   ```bash
   # If running locally
   mongod
   ```

5. **Run the development servers**
   ```bash
   # Terminal 1 - Server
   cd server
   npm run dev
   
   # Terminal 2 - Client
   cd client
   npm run dev
   ```

## Development Workflow

### Creating a New Feature

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Follow code style guidelines
   - Add/update tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   # Run linting
   cd server && npm run lint
   cd ../client && npm run lint
   
   # Test the application manually
   # Start both server and client, test functionality
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

### General Guidelines

- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused
- Follow the DRY principle (Don't Repeat Yourself)
- Use constants instead of magic numbers/strings

### JavaScript/React

- Use ES6+ features
- Use `const` by default, `let` when needed, never `var`
- Use arrow functions for callbacks
- Use destructuring when appropriate
- Use template literals for string interpolation

### ESLint

We use ESLint for code consistency. Run before committing:

```bash
# Server
cd server
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues

# Client
cd client
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Commit Messages

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add user profile editing
fix: resolve poll voting duplication issue
docs: update installation instructions
refactor: extract auth middleware to separate file
```

## Project Structure

### Server

```
server/
├── config/          # Configuration (database, passport)
├── constants/       # Application constants
├── data/           # Seed data
├── middleware/     # Express middleware
├── models/         # Mongoose models
├── utils/          # Utility functions
└── server.js       # Main application
```

### Client

```
client/
├── public/         # Static assets
└── src/
    ├── components/ # Reusable React components
    ├── lib/        # Utility libraries
    ├── pages/      # Page components
    ├── App.jsx     # Main app component
    └── main.jsx    # Entry point
```

### Key Principles

1. **Use existing utilities and constants**
   ```javascript
   // ❌ Don't
   if (password.length < 8) { ... }
   
   // ✅ Do
   import { VALIDATION_LIMITS } from './constants/index.js';
   if (password.length < VALIDATION_LIMITS.PASSWORD_MIN_LENGTH) { ... }
   ```

2. **Use middleware for cross-cutting concerns**
   ```javascript
   import { ensureAuthenticated, ensureRole } from './middleware/auth.js';
   router.post('/admin-only', ensureAuthenticated, ensureRole('admin'), handler);
   ```

3. **Sanitize user data**
   ```javascript
   import { sanitizeUser } from './utils/validation.js';
   res.json({ user: sanitizeUser(user) });
   ```

## Testing

### Manual Testing

1. Test all affected functionality
2. Check error cases
3. Verify on different screen sizes (for UI changes)
4. Test with different user roles (user, reporter, admin)

### Future: Automated Testing

We plan to add automated tests. When adding tests:

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write E2E tests for critical user flows
- Aim for good coverage, not 100%

## Submitting Changes

### Pull Request Process

1. **Update documentation** if needed
2. **Run linting** and fix all issues
3. **Test thoroughly** on your local environment
4. **Create PR** with clear description
5. **Link related issues** if applicable
6. **Respond to feedback** from reviewers

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] I've run the linter and fixed all issues
- [ ] I've tested the changes locally
- [ ] I've updated documentation if needed
- [ ] No sensitive data (passwords, keys) committed
```

## Code Review Guidelines

### As a Reviewer

- Be respectful and constructive
- Focus on the code, not the person
- Explain why changes are needed
- Acknowledge good work
- Approve when ready, request changes if needed

### As a Contributor

- Be open to feedback
- Ask questions if unclear
- Make requested changes promptly
- Thank reviewers for their time

## Areas We Need Help

- Writing tests (unit, integration, E2E)
- Improving documentation
- Adding new features (see GitHub issues)
- Bug fixes
- Performance improvements
- Accessibility improvements
- Internationalization (i18n)

## Questions?

- Check existing documentation in `/docs`
- Review `CODE_STRUCTURE.md` for architecture details
- Review `SECURITY.md` for security guidelines
- Open a GitHub issue for general questions
- Join our community discussions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Thank You!

Your contributions make Apofasi better for everyone! 🎉
