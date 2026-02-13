```markdown
# Carrier Integration Service

A TypeScript and Express backend service that integrates with the UPS Rating API to provide shipping rates.

---

## Overview

This service acts as a normalized layer between client applications and the UPS API. Clients send simplified, intuitive requests, and the service handles authentication, request transformation, and response normalization.

---

## Architecture

### 1. Token Management

- Implements OAuth 2.0 Authorization Code flow with refresh tokens
- Automatic token caching with expiry handling
- Prevents concurrent token refresh requests
- Fully transparent to API consumers

### 2. Middleware Stack

- **Rate Limiting**
  - 100 requests per 60 seconds per IP
- **Authentication**
  - Manages OAuth token lifecycle
- **Request Validation**
  - Zod schemas for all incoming requests

### 3. Error Handling

- Structured error responses with actionable details
- Custom error types:
  - `AuthenticationError`
  - `CarrierError`

### 4. Request and Response Normalization

- Clients send a simple, intuitive request format
- Service converts requests to UPS-specific format
- UPS responses are normalized before returning to clients
- Clients do not need to understand UPS API structure

### 5. Extensible Design

- Currently supports UPS via a `getRate()` function
- Can be refactored into a singleton class to support additional UPS operations
- Designed for future carrier integrations
- Environment-based configuration with no hardcoded credentials

---

## Installation

Clone the repository and install dependencies:

```bash
bun install
```

---

## Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

### Required Variables

- `PORT`  
  Server port. Default: `3000`

- `CLIENT_ID`  
  UPS OAuth client ID

- `CLIENT_SECRET`  
  UPS OAuth client secret

---

## Running the Service

### Development

```bash
bun index.ts
```

### Run Tests

```bash
bun test
```

---

## API Endpoints

### Rate Shopping

**POST** `/api/v1/rates/shop`

Returns shipping rates. Authentication required.

#### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/rates/shop \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "postalCode": "10001",
      "countryCode": "US"
    },
    "destination": {
      "postalCode": "90210",
      "countryCode": "US"
    },
    "packages": [
      {
        "dimensions": {
          "height": 10,
          "width": 10,
          "length": 10
        },
        "weight": {
          "value": 5
        }
      }
    ]
  }'
```

#### Example Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Future Improvements

### 1. Additional UPS Operations

- Address validation
- Shipment creation
- Tracking

### 2. Caching Layer

- Redis for token caching
- Rate quote caching with TTL

### 3. Security Enhancements

- API key rotation
- Rate limiting by API key instead of IP
- Improved secrets management

### 4. User Authentication System

Currently, the service makes requests on behalf of users without storing user information.

Future improvements:

- User signup endpoint
- User signin endpoint
- Persistent user storage in a database
- Per-user rate limits and API key management

---
```
