# Appointment API

An Express.js API service that manages optical appointments and integrates with NForce for automated appointment calls.

## Overview

This API service is built with TypeScript and Express.js, providing endpoints to manage optical appointments and integrate with an external calling service (NForce). It includes features for retrieving, transforming, and processing appointment data for automated customer communications.

## Features

- Appointment management
- NForce integration for automated calls
- Database integration with MySQL
- Environment configuration
- Health check endpoints
- Appointment data transformation
- Mock/Fake NForce service for testing

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MySQL (via mysql2)
- Jest (for testing)
- Cors
- Dotenv

## Project Structure

```
appointment-api/
├── src/
│   ├── __tests__/           # Test files
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── types/            # TypeScript type definitions
│   ├── app.ts            # Express app setup
│   └── index.ts          # Application entry point
├── .env                  # Environment variables
├── .env.example         # Environment variables template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── jest.config.js       # Jest testing configuration
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment variables:
   ```
   # Database Configuration
   DATABASE_USERNAME=
   DATABASE_PORT=
   DATABASE_PASSWORD=
   DATABASE_NAME=
   DATABASE_HOST=

   # JWT Configuration
   ACCESS_TOKEN_SECRET=
   REFRESH_TOKEN_SECRET=
   ACCESS_TOKEN_EXPIRES_IN=

   # NForce Configuration
   NFORCE_API_URL=
   NFORCE_TOKEN=
   NFORCE_AGENT_ID=
   NFORCE_DELAY_BETWEEN_REQUESTS=
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Running Tests
```bash
npm test
```

## API Endpoints

### Health Check
- `GET /health` - Check API and database health

### Appointments
- `POST /api/appointments` - Get appointments by IDs
- `POST /api/appointments/transformed` - Get transformed appointments
- `POST /api/appointments/nforce` - Process appointments through NForce
- `POST /api/appointments/fake-nforce` - Process appointments through mock NForce (for testing)

## Data Models

### Appointment
```typescript
interface Appointment {
    idOptic: string;
    opticName: string;
    appointmentId: string;
    appointmentDate: Date;
    appointmentDateUnix: number;
    firstName: string;
    idCustomer: string;
    phoneNumber: string;
}
```

### Transformed Appointment
```typescript
interface TransformedAppointment {
    agent_id: number;
    input: {
        instructions: {
            languageForCall: string;
            idOptic: string;
            opticName: string;
            appointmendId: string;
            appointmentDate: number;
            firstName: string;
            idCustomer: string;
            phoneNumber: string;
            utms: UtmParams;
        };
    };
    metadata: Record<string, unknown>;
}
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid input validation
- Database connection issues
- NForce integration errors
- Transformation errors

## Testing

The project includes Jest tests for:
- Service functions
- API endpoints
- Data transformations
- Mock NForce integration

## License

ISC

## Author

Author information can be added here