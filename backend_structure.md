# Backend File Structure Documentation

This document explains the purpose and functionality of the key files and directories in the `backend/` folder.

## Root Directory
- **`src/server.ts`**: The entry point of the application. It initializes the database connection and starts the Express server.
- **`src/app.ts`**: Configures the Express application, including middleware (CORS, JSON parsing, logging) and route registration. It also defines the global error handler.

## Configuration (`src/config/`)
- **`database.ts`**: Manages the MySQL database connection pool using `mysql2/promise`. It exports the pool for use in controllers.

## Controllers (`src/controllers/`)
Contains the business logic for each feature.
- **`authController.ts`**: Handles user registration and login.
- **`tableController.ts`**: Manages table operations (add, update, delete, fetch).
- **`queueController.ts`**: Manages the customer queue (join, leave, fetch).
- **`reservationController.ts`**: Handles table reservations.
- **`orderController.ts`**: Manages food orders.
- **`serviceController.ts`**: Handles service requests (e.g., "Call Waiter").

## Routes (`src/routes/`)
Defines the API endpoints and maps them to controllers.
- **`authRoutes.ts`**: `/api/auth` (Register, Login)
- **`tableRoutes.ts`**: `/api/tables` (CRUD operations for tables)
- **`queueRoutes.ts`**: `/api/queue` (Queue management)
- **`reservationRoutes.ts`**: `/api/reservations`
- **`orderRoutes.ts`**: `/api/orders`
- **`serviceRoutes.ts`**: `/api/service`

## Middlewares (`src/middlewares/`)
- **`authMiddleware.ts`**:
  - `authenticate`: Verifies JWT tokens on protected routes.
  - `authorize`: Checks if the authenticated user has the required role (e.g., 'Manager').

## Utilities (`src/utils/`)
- Helper functions for validation or other common tasks.
