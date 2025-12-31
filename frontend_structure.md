# Frontend File Structure Documentation

This document explains the purpose and functionality of the key files and directories in the `frontend/` folder.

## Root Directory (`src/app/`)
- **`app.component.ts`**: The root component of the Angular application. It defines the main layout and router outlet.
- **`app.routes.ts`**: Configures the application's routing logic, mapping URLs to components (e.g., `/login`, `/manager`, `/tables`).
- **`app.config.ts`**: Application-wide configuration, including providers for HTTP clients and interceptors.

## Components (`src/app/components/`)
Contains the UI components for different features.
- **`login/`**: Handles user authentication.
- **`register/`**: Handles new customer registration.
- **`manager-dashboard/`**: The main dashboard for managers, showing live floor status and metrics.
- **`table-list/`**: A view for managing tables (add/delete) and viewing the floor plan.
- **`queue-management/`**: Allows customers to join the queue and managers to view it.
- **`reservation/`**: Handles table reservation requests.
- **`customer-dashboard/`**: The main view for logged-in customers.

## Services (`src/app/services/`)
Handles communication with the backend API.
- **`auth.service.ts`**: Manages login, registration, and token storage.
- **`table.service.ts`**: Fetches and updates table data.
- **`queue.service.ts`**: Manages queue operations.
- **`reservation.service.ts`**: Manages reservations.

## Interceptors (`src/app/interceptors/`)
- **`auth.interceptor.ts`**: Automatically attaches the JWT token (Bearer token) to every outgoing HTTP request to authenticated endpoints.
