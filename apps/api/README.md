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
  "path": "facebook/react"
}
```

**Response:**

- `201` - Repository added successfully
- `400` - Invalid request data
- `401` - Authentication failed (missing or invalid token)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication with the following characteristics:

- **Algorithm**: RS256 (asymmetric key signing)
- **Token Structure**: Contains `userId` claims
- **Expiration**: 365 days
- **Header Format**: `Authorization: Bearer <token>`

### Protected Routes

Routes that require authentication are protected by the `authMiddleware`. The middleware:

1. Extracts the JWT token from the `Authorization` header
2. Verifies the token signature using the public key
3. Decodes the token payload to extract user information
4. Attaches user data to the request object (`req.user`)