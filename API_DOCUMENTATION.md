# API Documentation

This document describes the REST API endpoints available in the Apofasi application.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: (your production URL)

All API endpoints are prefixed with `/api` (e.g., `/api/news`, `/api/polls`).

## Authentication

The API uses session-based authentication with cookies. OAuth providers (Google, Facebook) are also supported if configured.

### Auth Endpoints

#### Check Authentication Status
```
GET /api/auth/status
```

**Response:**
```json
{
  "authenticated": true,
  "providers": {
    "google": true,
    "facebook": true
  },
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

#### Register (Local)
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "displayName": "John Doe",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

#### Login (Local)
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

#### OAuth Login (Google)
```
GET /api/auth/google
```
Redirects to Google OAuth consent screen.

#### OAuth Login (Facebook)
```
GET /api/auth/facebook
```
Redirects to Facebook OAuth consent screen.

#### Get Profile
```
GET /api/auth/profile
```
**Authentication Required**: Yes

**Response:** `200 OK`
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user",
    "region": "Αττική",
    "cityOrVillage": "Αθήνα"
  }
}
```

#### Update Profile
```
PUT /api/auth/profile
```
**Authentication Required**: Yes

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "region": "Αττική",
  "cityOrVillage": "Αθήνα",
  "avatar": "data:image/png;base64,..."
}
```

**Response:** `200 OK`
```json
{
  "user": { /* updated user object */ }
}
```

#### Logout
```
GET /api/auth/logout
```

**Response:** `200 OK`
```json
{
  "message": "Logged out"
}
```

---

## News Endpoints

#### List News
```
GET /api/news
```

**Response:** `200 OK`
```json
{
  "news": [
    {
      "id": "news_id",
      "title": "News Title",
      "content": "News content...",
      "author": {
        "id": "author_id",
        "displayName": "Author Name"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Create News
```
POST /api/news
```
**Authentication Required**: Yes  
**Required Role**: `reporter` or `admin`

**Request Body:**
```json
{
  "title": "News Title",
  "content": "News content..."
}
```

**Response:** `201 Created`
```json
{
  "news": {
    "id": "news_id",
    "title": "News Title",
    "content": "News content...",
    "author": { /* author object */ },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Poll Endpoints

#### List Polls
```
GET /api/polls
```

**Response:** `200 OK`
```json
{
  "polls": [
    {
      "id": "poll_id",
      "question": "Poll question?",
      "options": [
        {
          "id": "option_id",
          "text": "Option 1",
          "votes": 5
        },
        {
          "id": "option_id",
          "text": "Option 2",
          "votes": 3
        }
      ],
      "tags": ["tag1", "tag2"],
      "region": "Αττική",
      "cityOrVillage": "Αθήνα",
      "createdBy": {
        "id": "user_id",
        "displayName": "John Doe"
      },
      "isAnonymousCreator": false,
      "anonymousResponses": true,
      "totalVotes": 8,
      "hasVoted": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Single Poll
```
GET /api/polls/:pollId
```

**Response:** `200 OK`
```json
{
  "poll": { /* poll object */ }
}
```

#### Create Poll
```
POST /api/polls
```
**Authentication Required**: Yes

**Request Body:**
```json
{
  "question": "Your poll question?",
  "options": ["Option 1", "Option 2", "Option 3"],
  "tags": ["tag1", "tag2"],
  "region": "Αττική",
  "cityOrVillage": "Αθήνα",
  "isAnonymousCreator": false,
  "anonymousResponses": true
}
```

**Response:** `201 Created`
```json
{
  "poll": { /* created poll object */ }
}
```

#### Vote on Poll
```
POST /api/polls/:pollId/vote
```
**Authentication Required**: Depends on poll settings

**Request Body:**
```json
{
  "optionId": "option_id"
}
```

**Response:** `200 OK`
```json
{
  "poll": { /* updated poll object with new vote counts */ }
}
```

---

## User Management Endpoints

**All user management endpoints require `admin` role.**

#### List Users
```
GET /api/users?search=keyword
```
**Authentication Required**: Yes  
**Required Role**: `admin`

**Query Parameters:**
- `search` (optional): Search by email, displayName, username, firstName, or lastName

**Response:** `200 OK`
```json
{
  "users": [
    {
      "id": "user_id",
      "email": "user@example.com",
      "displayName": "John Doe",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Update User Role
```
PUT /api/users/:userId/role
```
**Authentication Required**: Yes  
**Required Role**: `admin`

**Request Body:**
```json
{
  "role": "reporter"
}
```

**Allowed Roles:** `user`, `reporter`, `admin`

**Response:** `200 OK`
```json
{
  "user": { /* updated user object */ }
}
```

---

## Contact Endpoints

#### Send Contact Message
```
POST /api/contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "topic": "general",
  "message": "Your message here (min 10 characters)"
}
```

**Note:** If user is authenticated, `name` and `email` can be omitted (will use user's data).

**Response:** `201 Created`
```json
{
  "message": "Το μήνυμα καταχωρήθηκε με επιτυχία.",
  "contact": {
    "id": "contact_id",
    "topic": "general",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error description in Greek or English"
}
```

### Common HTTP Status Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., email already used)
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service not configured (e.g., OAuth provider)

---

## Data Types and Validation

### User Roles
- `user` - Regular user (default)
- `reporter` - Can create news
- `admin` - Full access

### Regions (Greek administrative regions)
See `/shared/locations.js` for complete list:
- Αττική
- Κεντρική Μακεδονία
- Δυτική Μακεδονία
- ... (and more)

### Validation Limits
- Password: min 8 characters
- Contact message: min 10 characters
- Avatar: max 320KB
- Poll options: min 2 unique options
- Poll tags: max 10 tags

### Image Upload Format
Avatar images must be base64-encoded data URLs:
```
data:image/jpeg;base64,/9j/4AAQSkZJRg...
data:image/png;base64,iVBORw0KGgo...
data:image/webp;base64,UklGRiQAAABX...
```

Supported formats: JPEG, PNG, WebP

---

## Rate Limiting

Rate limiting is recommended for production but not currently implemented.

---

## CORS

Cross-Origin Resource Sharing (CORS) is configured based on the `CLIENT_ORIGIN` environment variable. Credentials are enabled for authenticated requests.

---

## WebSocket Support

Not currently implemented.

---

## Versioning

The API is currently unversioned. Future versions may use `/api/v1/` prefix.

---

## Testing the API

### Using curl

```bash
# Get news
curl http://localhost:5000/api/news

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login and save cookies
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Create poll (authenticated)
curl -X POST http://localhost:5000/api/polls \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"question":"Test?","options":["Yes","No"]}'
```

### Using Postman/Insomnia

1. Import the API endpoints
2. Set base URL to `http://localhost:5000`
3. Enable cookie storage for authentication
4. Test endpoints

---

## Future Improvements

- Add pagination for list endpoints
- Add filtering and sorting options
- Add WebSocket support for real-time updates
- Add API versioning
- Add rate limiting
- Add request/response examples for all error cases
- Generate OpenAPI/Swagger documentation

---

## Questions?

For issues or questions about the API, please:
- Check the server logs
- Review `CODE_STRUCTURE.md` for implementation details
- Open a GitHub issue
