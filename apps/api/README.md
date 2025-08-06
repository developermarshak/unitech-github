# API Server

This is the API server for the Unitech application, built with Express.js, TypeScript, and TypeORM.

## Features

- User registration and authentication
- JWT-based session management with RS256 algorithm
- Authentication middleware for protected routes
- Input validation using Zod
- Dependency injection with tsyringe
- Error handling middleware

## Endpoints

### POST /api/users
Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
- `201` - User created successfully
- `400` - Invalid request data
- `409` - User already exists

### POST /api/users/session
Creates a new session (login).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
- `200` - Session created successfully
  ```json
  {
    "accessToken": "jwt-token-here"
  }
  ```
- `400` - Invalid request data
- `401` - Authentication failed

### POST /api/repositories
Adds a new repository (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "my-repository",
  "description": "A sample repository"
}
```

**Response:**
- `201` - Repository added successfully
- `400` - Invalid request data
- `401` - Authentication failed (missing or invalid token)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with the following characteristics:

- **Algorithm**: RS256 (asymmetric key signing)
- **Token Structure**: Contains `userId` and `sessionId` claims
- **Expiration**: 365 days
- **Header Format**: `Authorization: Bearer <token>`

### Protected Routes

Routes that require authentication are protected by the `authMiddleware`. The middleware:

1. Extracts the JWT token from the `Authorization` header
2. Verifies the token signature using the public key
3. Decodes the token payload to extract user information
4. Attaches user data to the request object (`req.user`)

### Using Protected Routes

To access protected routes, include the JWT token in the request headers:

```bash
curl -X POST http://localhost:3000/api/repositories \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-repo", "description": "Test repository"}'
```

## Development

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Generate JWT keys:
   ```bash
   pnpm run generate:jwt-keys
   ```

3. Set up environment variables (create `.env` file):
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_PUBLIC_KEY=your-public-key
   JWT_SECRET_KEY=your-private-key
   ```

4. Run database migrations:
   ```bash
   # Add migration command when available
   ```

### Running the Server

Development mode:
```bash
pnpm dev
```

Production build:
```bash
pnpm build
pnpm start
```

## Testing

The API includes comprehensive functional tests for the user endpoints.

### Running Tests

Run all tests:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

### Test Structure

- `src/__tests__/userEndpoints.simple.test.ts` - Basic validation tests
- `src/__tests__/userEndpoints.comprehensive.test.ts` - Full test suite including business logic
- `src/__tests__/setup.ts` - Test configuration and mocks

### Test Coverage

The tests cover:

**Create User Endpoint (`POST /api/users`):**
- ✅ Valid user creation
- ✅ Email validation (format, required)
- ✅ Password validation (length, required)
- ✅ Duplicate user handling
- ✅ Error handling

**Create Session Endpoint (`POST /api/users/session`):**
- ✅ Valid session creation
- ✅ Email validation (format, required)
- ✅ Password validation (length, required)
- ✅ Authentication failure handling
- ✅ Error handling

**Integration Tests:**
- ✅ User creation followed by session creation
- ✅ End-to-end workflow validation

### Test Dependencies

- **Jest** - Test framework
- **Supertest** - HTTP testing
- **ts-jest** - TypeScript support for Jest

The tests use mocking to isolate the HTTP layer from the database and external dependencies, ensuring fast and reliable test execution. 