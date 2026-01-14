# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. **Do NOT** open a public issue
2. Email the maintainer directly with details
3. Include steps to reproduce the vulnerability
4. Allow time for a fix before public disclosure

## Security Best Practices

### Environment Variables

**CRITICAL**: Never commit `.env` files to version control.

- Always use `.env.example` as a template
- Keep actual credentials in `.env` (ignored by git)
- Rotate secrets regularly
- Use strong, unique values for:
  - `SESSION_SECRET`
  - `MONGO_URI` (especially username/password)
  - OAuth client secrets

### Password Security

- Passwords are hashed using scrypt (Node.js crypto)
- Minimum password length: 8 characters
- Timing-safe comparison prevents timing attacks
- Passwords are never logged or stored in plain text

### Session Security

- Sessions use secure cookies in production (`secure: true`)
- `httpOnly` flag prevents JavaScript access
- `sameSite` set to `none` in production for cross-origin
- Sessions stored in MongoDB with automatic TTL expiration
- Session secret should be a strong random string

### Input Validation

- Email validation using regex
- RegEx injection prevented with `escapeRegex()` utility
- Image uploads validated for format and size
- User inputs sanitized before database operations
- Mongoose provides built-in protection against NoSQL injection

### Authentication & Authorization

- Protected routes require authentication
- Role-based access control (user, reporter, editor, admin)
- OAuth providers (Google, Facebook) properly configured
- User data sanitized before sending to client

### CORS Configuration

- Allowed origins defined in `CLIENT_ORIGIN` env variable
- Credentials enabled for authenticated requests
- Pre-flight requests properly handled

### Error Handling

- Sensitive information not exposed in error messages
- Sentry integration for production error tracking
- Stack traces not sent to clients in production
- Passwords redacted from request logs

### Database Security

- MongoDB connection uses authentication
- Credentials not hardcoded in code
- Connection string in environment variables
- Indexes prevent common attack patterns

## Security Headers (Recommended)

Consider adding `helmet.js` for additional security headers:

```javascript
import helmet from 'helmet';
app.use(helmet());
```

## Rate Limiting (Recommended)

Consider adding rate limiting to prevent abuse:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Dependencies

- Keep dependencies up to date
- Run `npm audit` regularly
- Review security advisories for used packages
- Use `npm audit fix` to auto-update vulnerable packages

## Production Checklist

- [ ] All `.env` files use strong, unique secrets
- [ ] `NODE_ENV=production` in production
- [ ] HTTPS enabled (cookies set to `secure: true`)
- [ ] MongoDB authentication enabled
- [ ] Firewall configured to restrict database access
- [ ] Regular backups of database
- [ ] Sentry (or similar) configured for error tracking
- [ ] Rate limiting enabled
- [ ] Security headers added (helmet.js)
- [ ] Dependencies updated and audited
- [ ] OAuth redirect URLs match production domain
- [ ] CORS origins restricted to production domains

## Known Security Considerations

### Voting Security

The voting system implements multiple security measures to prevent vote manipulation:

#### Registered User Polls
- **One vote per account**: Users can only vote once per poll, tracked by their user ID
- **Device independent**: Users cannot vote multiple times by changing devices, browsers, or IP addresses
- **Transparent tracking**: All votes are associated with the user's account
- **Vote audit**: The system tracks which users voted for which options (visible to poll creator and admins)

#### Anonymous Polls
- **Dual-factor tracking**: Requires BOTH session ID AND IP address to match for vote identification
- **Enhanced security**: Users cannot simply clear cookies or change IP to vote again - they must do both
- **Session-based**: Each browser session is tracked with a unique session identifier
- **IP-based**: The voter's IP address is recorded and must match for vote changes
- **User agent tracking**: Browser/device information is stored for audit purposes
- **No personal data**: No personally identifiable information is stored with anonymous votes

#### Security Measures
1. **Preventing multiple votes**:
   - Registered users: Tied to user account (userId)
   - Anonymous users: Requires matching session ID AND IP address
2. **Vote integrity**:
   - Vote counts are incremented/decremented atomically
   - Database constraints prevent duplicate votes
   - Timestamps track when votes were cast
3. **Transparency**:
   - Poll responses include security information
   - Users are informed about how their vote is protected
   - Creators can see security method used for their polls

#### Limitations
- Anonymous votes can potentially be circumvented by:
  - Using a different device AND different network (VPN/proxy)
  - Clearing browser data (session) AND changing IP address simultaneously
- For critical polls requiring high security, use registered user voting instead of anonymous voting
- Consider implementing additional measures like:
  - Rate limiting (already recommended below)
  - CAPTCHA for anonymous votes
  - Email verification for registered users
  - Phone number verification for high-security polls

### XSS Prevention
- User-generated content should be sanitized
- Consider using DOMPurify on the client side
- React provides some built-in XSS protection

### CSRF Protection
- Not currently implemented for API routes
- Consider adding CSRF tokens for state-changing operations
- OAuth flows use standard security measures

### File Uploads
- Avatar uploads limited to 320KB
- Only image formats allowed (JPEG, PNG, WebP)
- Base64 encoding validated
- Consider adding virus scanning for production

## Security Updates

This project uses:
- Passport.js for authentication
- Mongoose for database operations
- Express-session for session management
- Sentry for error tracking

Keep these dependencies updated to receive security patches.

## Compliance

- GDPR: User data can be deleted (implement user deletion)
- Password storage: Industry-standard hashing
- Data minimization: Only collect necessary information
- Audit trail: Consider logging important actions

## Questions?

For security-related questions or concerns, contact the project maintainer.
