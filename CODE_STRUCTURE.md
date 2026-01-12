# Code Structure Improvements

This document outlines improvements made to the codebase for better maintainability, security, and development experience.

## Security Improvements

### ✅ Environment Variables Protection
- Added `.env` files to `.gitignore` to prevent committing sensitive credentials
- Removed tracked `.env` files from git history
- Keep `.env.example` files as templates

**Action Required**: After pulling these changes, create your own `.env` files based on `.env.example`

## Code Organization

### New Directory Structure

```
server/
├── config/          # Configuration modules (db, passport)
├── constants/       # Application constants and error messages
├── data/           # Default/seed data
├── db/             # Database initialization scripts
├── middleware/     # Express middleware (auth, error handling)
├── models/         # Mongoose models
├── routes/         # API route handlers (future improvement)
├── scripts/        # Utility scripts
├── utils/          # Helper functions and utilities
└── server.js       # Main application file
```

### New Modules

#### Constants (`server/constants/`)
- **index.js**: Centralized constants for roles, validation limits, error messages
  - `USER_ROLES`, `AUTH_PROVIDERS`
  - `VALIDATION_LIMITS`
  - `ERROR_MESSAGES`, `SUCCESS_MESSAGES`

#### Utilities (`server/utils/`)
- **validation.js**: Common validation functions
  - `escapeRegex()`: Prevent regex injection
  - `isValidEmail()`: Email validation
  - `validateImageFormat()`: Image format validation
  - `normalizeStringArray()`: Array normalization
  - `sanitizeUser()`: User object sanitization
  - `serializeAuthor()`: Author serialization

- **crypto.js**: Password hashing utilities
  - `hashPassword()`: Hash passwords with scrypt
  - `verifyPassword()`: Verify password against hash

- **serializers.js**: API response serializers
  - `serializeNews()`: Serialize news for API
  - `serializePoll()`: Serialize polls for API

#### Middleware (`server/middleware/`)
- **auth.js**: Authentication and authorization
  - `ensureAuthenticated()`: Require auth
  - `ensureRole()`: Require specific role
  - `ensureProviderConfigured()`: Check OAuth config

- **errorHandler.js**: Error handling
  - `errorHandler()`: Global error handler
  - `setupSentryHandlers()`: Sentry integration
  - `requestLogger()`: Request logging for debugging

## Development Tools

### Linting

#### ESLint Configuration
- Server: `.eslintrc.json` for Node.js/ES modules
- Client: `.eslintrc.json` for React/JSX

#### New Scripts
```bash
# Server
npm run lint          # Check code style
npm run lint:fix      # Auto-fix issues
npm run check-env     # Verify environment setup

# Client
npm run lint          # Check code style
npm run lint:fix      # Auto-fix issues
```

## Best Practices

### 1. Use Constants
Replace hardcoded strings with constants:
```javascript
// ❌ Before
return res.status(401).json({ message: 'Απαιτείται σύνδεση.' });

// ✅ After
import { ERROR_MESSAGES } from './constants/index.js';
return res.status(401).json({ message: ERROR_MESSAGES.AUTH_REQUIRED });
```

### 2. Use Utility Functions
Replace inline code with reusable utilities:
```javascript
// ❌ Before
const normalizedEmail = String(email).toLowerCase().trim();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) { ... }

// ✅ After
import { isValidEmail } from './utils/validation.js';
if (!isValidEmail(email)) { ... }
```

### 3. Centralized Error Handling
Use middleware for consistent error handling:
```javascript
import { errorHandler } from './middleware/errorHandler.js';
app.use(errorHandler);
```

## Future Improvements

### Recommended Next Steps

1. **Split Routes**: Extract route handlers from `server.js` to separate files
   ```
   server/routes/
   ├── auth.js
   ├── news.js
   ├── polls.js
   ├── users.js
   └── contact.js
   ```

2. **Add Tests**: Implement unit and integration tests
   - Jest or Mocha for testing framework
   - Supertest for API testing

3. **Add API Documentation**: Use Swagger/OpenAPI
   - Document all endpoints
   - Generate interactive API docs

4. **Environment Validation**: Use a library like `joi` or `zod`
   - Validate required environment variables on startup
   - Provide clear error messages for missing config

5. **Input Validation**: Add comprehensive input validation
   - Use express-validator or joi
   - Validate all user inputs before processing

6. **Rate Limiting**: Add rate limiting middleware
   - Prevent abuse
   - Protect against DDoS

7. **Add TypeScript** (optional): For better type safety

8. **Logging**: Implement structured logging
   - Use Winston or Pino
   - Log levels: error, warn, info, debug

## Migration Guide

### For Developers

1. **Pull latest changes**
   ```bash
   git pull origin main
   ```

2. **Create `.env` files**
   ```bash
   # Server
   cp server/.env.example server/.env
   # Edit server/.env with your actual values
   
   # Client
   echo "VITE_API_BASE_URL=http://localhost:5000" > client/.env
   ```

3. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

4. **Run linting**
   ```bash
   # Check for issues
   npm run lint
   
   # Auto-fix what can be fixed
   npm run lint:fix
   ```

## Security Checklist

- [x] `.env` files in `.gitignore`
- [x] Removed `.env` from git tracking
- [x] Password hashing with scrypt
- [x] Input sanitization helpers
- [x] CORS configuration
- [x] Session security (httpOnly, secure in production)
- [ ] Rate limiting (recommended)
- [ ] Input validation middleware (recommended)
- [ ] SQL injection prevention (using Mongoose, built-in)
- [ ] XSS prevention (recommended: add helmet.js)

## Performance Considerations

- Database indexes are defined in models
- Session store uses MongoDB with TTL
- Static files served efficiently in production
- JSON body size limited to 1MB

## Contributing

When adding new features:
1. Use existing constants and utilities
2. Follow the established directory structure
3. Add appropriate error handling
4. Update this documentation
5. Run linting before committing
6. Never commit `.env` files

## Questions?

See also:
- `/server/README.md` - Server setup guide
- `/README.md` - Main project README
- `/server/DB_SCHEMA.md` - Database schema documentation
