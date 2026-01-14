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
**Status**: DEPRECATED (returns 410 Gone)

**Note**: Standalone news items are no longer supported. Use articles with the `isNews` flag instead. See "Tag Article as News" endpoint.

**Authentication Required**: Yes  
**Required Role**: `reporter`, `editor`, or `admin`

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

## Article Endpoints

Articles are the primary content type for news in the application. Articles can be tagged as news by users with the `reporter`, `editor`, or `admin` role.

#### List Articles
```
GET /api/articles
```
**Authentication Required**: No

**Response:** `200 OK`
```json
{
  "articles": [
    {
      "id": "article_id",
      "title": "Article Title",
      "content": "Article content...",
      "author": {
        "id": "user_id",
        "displayName": "Author Name"
      },
      "tags": ["tag1", "tag2"],
      "region": "Αττική",
      "cityOrVillage": "Αθήνα",
      "isNews": true,
      "taggedAsNewsBy": {
        "id": "editor_id",
        "displayName": "Editor Name"
      },
      "taggedAsNewsAt": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### Get Article Details
```
GET /api/articles/:articleId
```
**Authentication Required**: No

**Response:** `200 OK` - Returns single article object

#### Create Article
```
POST /api/articles
```
**Authentication Required**: Yes

**Request Body:**
```json
{
  "title": "Article Title",
  "content": "Article content...",
  "tags": ["tag1", "tag2"],
  "region": "Αττική",
  "cityOrVillage": "Αθήνα"
}
```

**Response:** `201 Created`
```json
{
  "article": { /* article object */ }
}
```

#### Update Article
```
PUT /api/articles/:articleId
```
**Authentication Required**: Yes (must be author)

**Request Body:** Same as Create Article

**Response:** `200 OK`

#### Delete Article
```
DELETE /api/articles/:articleId
```
**Authentication Required**: Yes (must be author or admin)

**Response:** `200 OK`
```json
{
  "message": "Το άρθρο διαγράφηκε επιτυχώς."
}
```

#### Tag Article as News
```
PUT /api/articles/:articleId/tag-as-news
```
**Authentication Required**: Yes  
**Required Role**: `reporter`, `editor`, or `admin`

Marks an article as news. The article will appear in the news feed.

**Response:** `200 OK`
```json
{
  "article": {
    "id": "article_id",
    "isNews": true,
    "taggedAsNewsBy": {
      "id": "editor_id",
      "displayName": "Editor Name"
    },
    "taggedAsNewsAt": "2024-01-15T10:30:00.000Z",
    ...
  }
}
```

#### Untag Article as News
```
PUT /api/articles/:articleId/untag-as-news
```
**Authentication Required**: Yes  
**Required Role**: `reporter`, `editor`, or `admin`

Removes the news flag from an article. The article will no longer appear in the news feed.

**Response:** `200 OK`

#### Get My Articles
```
GET /api/articles/my-articles
```
**Authentication Required**: Yes

Returns all articles created by the authenticated user.

**Response:** `200 OK` - Returns array of article objects

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
          "votes": 5,
          "status": "approved",
          "createdBy": null,
          "photoUrl": null,
          "photo": null,
          "profileUrl": null
        },
        {
          "id": "option_id",
          "text": "Option 2",
          "votes": 3,
          "status": "approved",
          "createdBy": null,
          "photoUrl": null,
          "photo": null,
          "profileUrl": null
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
      "allowUserOptions": false,
      "userOptionApproval": "auto",
      "optionsArePeople": false,
      "linkPolicy": {
        "mode": "any",
        "allowedDomains": []
      },
      "totalVotes": 8,
      "hasVoted": false,
      "isCreatorOrAdmin": false,
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
  "anonymousResponses": true,
  "allowUserOptions": false,
  "userOptionApproval": "auto",
  "optionsArePeople": false,
  "linkPolicy": {
    "mode": "any",
    "allowedDomains": []
  }
}
```

**Note**: 
- `options` can be an array of strings (legacy) or an array of objects for people mode
- When `allowUserOptions` is `true`, polls can be created with 0 options
- When `allowUserOptions` is `false`, at least 2 unique options are required
- People mode options require: `{text}` (name/text is required)
  - `photoUrl` (optional): HTTPS URL to a photo
  - `photo` (optional): Base64-encoded image data URL
  - `profileUrl` (optional): HTTPS URL to a profile (validated against `linkPolicy` if provided)
- `userOptionApproval`: "auto" | "creator" (default: "auto")
- `linkPolicy.mode`: "any" | "allowlist" (default: "any")

**People Mode Example:**
```json
{
  "question": "Who should be the next mayor?",
  "options": [
    {
      "text": "John Doe",
      "photoUrl": "https://example.com/john.jpg",
      "profileUrl": "https://linkedin.com/in/johndoe"
    },
    {
      "text": "Jane Smith",
      "photo": "data:image/jpeg;base64,...",
      "profileUrl": "https://twitter.com/janesmith"
    },
    {
      "text": "Alex Johnson"
    }
  ],
  "optionsArePeople": true,
  "linkPolicy": {
    "mode": "allowlist",
    "allowedDomains": ["linkedin.com", "twitter.com", "facebook.com"]
  }
}
```

**Empty Options Example (with allowUserOptions):**
```json
{
  "question": "What topics should we cover next?",
  "options": [],
  "allowUserOptions": true,
  "userOptionApproval": "creator"
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

#### Add Option to Poll
```
POST /api/polls/:pollId/options
```
**Authentication Required**: Optional (required unless poll allows anonymous responses)

**Request Body:**
```json
{
  "option": {
    "text": "New option text"
  }
}
```

**People Mode Example (all fields optional except text):**
```json
{
  "option": {
    "text": "Alex Johnson",
    "photoUrl": "https://example.com/alex.jpg",
    "profileUrl": "https://linkedin.com/in/alexj"
  }
}
```

**People Mode Example (minimal - text only):**
```json
{
  "option": {
    "text": "Sam Lee"
  }
}
```

**Response:** `201 Created`
```json
{
  "poll": { /* updated poll object */ },
  "message": "Η επιλογή προστέθηκε επιτυχώς." | "Η επιλογή σας υποβλήθηκε και εκκρεμεί έγκριση."
}
```

#### Get Pending Options (Creator/Admin Only)
```
GET /api/polls/:pollId/options/pending
```
**Authentication Required**: Yes  
**Required**: Poll creator or admin

**Response:** `200 OK`
```json
{
  "options": [
    {
      "id": "option_id",
      "text": "Pending option",
      "createdBy": { /* user object or null */ },
      "photoUrl": "https://...",
      "photo": "data:image/...",
      "profileUrl": "https://..."
    }
  ]
}
```

#### Approve Pending Option (Creator/Admin Only)
```
POST /api/polls/:pollId/options/:optionId/approve
```
**Authentication Required**: Yes  
**Required**: Poll creator or admin

**Response:** `200 OK`
```json
{
  "poll": { /* updated poll object */ },
  "message": "Η επιλογή εγκρίθηκε επιτυχώς."
}
```

#### Delete Option (Creator/Admin Only)
```
DELETE /api/polls/:pollId/options/:optionId
```
**Authentication Required**: Yes  
**Required**: Poll creator or admin

**Response:** `200 OK`
```json
{
  "poll": { /* updated poll object */ },
  "message": "Η επιλογή διαγράφηκε επιτυχώς."
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

**Allowed Roles:** `user`, `reporter`, `editor`, `admin`

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
