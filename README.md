# Smart Restaurant Queue & Table Management System

## Overview
A full-stack web application designed to streamline restaurant operations by managing table availability, customer queues, and reservations in real-time. The system provides distinct interfaces for Customers and Managers, ensuring a smooth dining experience and efficient floor management.

## Tech Stack
- **Frontend**: Angular 16+ (Angular Material, RxJS)
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL (using `mysql2` with promise support)
- **Authentication**: JWT (JSON Web Tokens)

## Documentation
Detailed documentation for the codebase structure can be found here:
- [Backend Structure](backend_structure.md)
- [Frontend Structure](frontend_structure.md)

## Features

### Customer
- **Registration**: Sign up for a new account (Role restricted to Customer).
- **Queue Management**: Join the waiting queue, view current position, and leave the queue.
- **Reservations**: Make table reservations (Future implementation).

### Manager
- **Dashboard**: View live floor status with real-time updates on table occupancy.
- **Table Management**: Add, delete, and update the status of tables (Available, Occupied, Reserved).
- **Queue Oversight**: Monitor and manage the customer queue.

## Setup Instructions

### Prerequisites
- Node.js (v14+ recommended)
- MySQL Server installed and running

### Database Setup
1. Create a database named `restaurant_db_v2`.
2. Import the schema from `backend/db_schema.sql` into MySQL.
   ```sql
   CREATE DATABASE restaurant_db_v2;
   USE restaurant_db_v2;
   SOURCE backend/db_schema.sql;
   ```

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with your database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=restaurant_db_v2
   JWT_SECRET=your_secret_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular application:
   ```bash
   ng serve
   ```
4. Open your browser and navigate to `http://localhost:4200`.

## Default Credentials
A default manager account is seeded for testing:
- **Email**: `manager@worldplate.com`
- **Password**: `manager123`

## API Endpoints
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Tables**: `/api/tables` (GET, POST, PUT, DELETE)
- **Queue**: `/api/queue` (GET, POST, DELETE)
