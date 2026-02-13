```markdown
# Carrier Integration Service

A TypeScript/Express backend service that integrates with UPS Rating API to provide shipping rates.

## Architecture

### Design Decisions

1. **Token Management**
   - Implements OAuth 2.0 authorization code flow with refresh tokens
   - Automatic token caching with expiry
   - Prevents concurrent token refresh requests
   - Transparent to API consumers

2. **Middleware Stack**
   - Rate limiting: 100 requests per 60 seconds per IP
   - Authentication: OAuth token lifecycle management
   - Request validation: Zod schemas for all inputs

3. **Error Handling**
   - Structured error responses with actionable details
   - Specific error types: AuthenticationError, CarrierError

4. **Request/Response Normalization**
   - Client sends simple, intuitive request format
   - Service converts to/from UPS API format
   - Clients never need to know UPS API details

5. **Extensible Design**
   - Currently supports UPS via `getRate()` function which can be made a part of a singleton class to add more functionalities to communicate with the UPS API
   - Environment-based configuration (no hardcoding)

### Installation

```bash
clone the repository and run bun install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Required variables:
- `PORT` - Server port (default: 3000)
- `CLIENT_ID` - UPS OAuth client ID
- `CLIENT_SECRET` - UPS OAuth client secret

### Running

```bash
# Development
bun index.ts

# Run tests
bun test
```

## API Endpoints

### Rate Shopping

**POST /api/v1/rates/shop**

Get shipping rates (requires authentication).

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

Response:
```json
{
  "success": true,
  "data": {...}
}
```

## Future Improvements

1. **Additional Operations**
   - Address validation

2. **Caching Layer**
   - Redis for token caching
   - Rate quote caching with TTL

3. **Security**
   - API key rotation
   - Rate limit by API key (not just IP) in the future

4. **Authentication**
   - Use a database to store real users
   - Have endpoints for users to signup and signin
   - Right now the structure is the service makes requests on behalf of users but there is no information of user being stored, so if I had more time, I would have created signup and signin requests and store user info
```
