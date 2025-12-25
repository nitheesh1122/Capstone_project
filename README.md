# Smart Restaurant Queue & Table Management System

## Objective
Develop a full-stack web application that enables restaurants to manage table availability, waiting queues, and reservations in real time.

## Tech Stack
- **Frontend**: Angular 16+ (Angular Material)
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL

## Setup Instructions

### Prerequisites
- Node.js installed
- MySQL Server running
1. Create a database named `restaurant_db`.
2. Import the schema from `backend/db_schema.sql` into MySQL.

### Backend Setup
1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies (already installed, but good to check):
   ```bash
   npm install
   ```
3. Configure `.env` file (ensure DB credentials are correct):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=password
   DB_NAME=restaurant_db
   JWT_SECRET=your_jwt_secret_key_here
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```
2. **Important**: Install Angular Material (if not already):
   ```bash
   ng add @angular/material
   ```
   Choose any theme (e.g., Indigo/Pink), setup global typography and animations as 'Yes'.
3. Run the application:
   ```bash
   ng serve
   ```
4. Open browser at `http://localhost:4200`.

## Features Implemented
- **User Roles**: Customer, Manager.
- **Table Management**: Tables List, Add Table (Manager), Update Status.
- **Queue Management**: Join Queue, View Position, Leave Queue.
- **Authentication**: JWT-based Login/Register.
