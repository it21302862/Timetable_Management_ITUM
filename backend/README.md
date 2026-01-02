# Timetable Management System - Backend

Backend API for ITUM University Timetable Management System built with Node.js, Express, and MySQL.

## Features

- **User Management**: CRUD operations for users (Admin, Faculty, Students)
- **Module Management**: CRUD operations for academic modules
- **Room Management**: CRUD operations for rooms with availability checking
- **Timetable Management**: Create, update, delete timetable slots with conflict detection
- **Conflict Detection**: Automatic detection of room and instructor conflicts
- **RESTful API**: Clean REST API design with proper HTTP status codes
- **Error Handling**: Centralized error handling middleware
- **Input Validation**: Comprehensive input validation in service layer
- **Database Connection Pooling**: Efficient database connection management

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── constants/       # Application constants
│   ├── controllers/    # HTTP request/response handlers
│   ├── middleware/     # Express middleware (error handling, logging)
│   ├── models/         # Data access layer (database operations)
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic layer
│   └── app.js          # Express app configuration
├── database/            # Database schema and migrations
├── server.js           # Application entry point
└── package.json        # Dependencies and scripts
```

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=timetable_db
   DB_CONNECTION_LIMIT=10
   ```

5. Set up the database:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in `.env`).

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with optional role filter)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/login` - User authentication

### Modules
- `POST /api/modules` - Create a new module
- `GET /api/modules` - Get all modules (with optional filters)
- `GET /api/modules/:id` - Get module by ID
- `GET /api/modules/code/:code` - Get module by code
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module

### Rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms` - Get all rooms (with optional filters)
- `GET /api/rooms/available` - Get available rooms for a time slot
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Timetable
- `POST /api/timetable` - Create a new timetable slot
- `GET /api/timetable` - Get weekly timetable (with optional filters)
- `GET /api/timetable/instructor/:instructorId` - Get timetable by instructor
- `GET /api/timetable/module/:moduleId` - Get timetable by module
- `GET /api/timetable/:id` - Get slot by ID
- `PUT /api/timetable/:id` - Update timetable slot
- `DELETE /api/timetable/:id` - Delete timetable slot

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

## Database Schema

The database includes the following tables:
- `users` - User accounts (Admin, Faculty, Students)
- `modules` - Academic modules
- `rooms` - Available rooms
- `timetable_slots` - Timetable entries

See `database/schema.sql` for the complete schema.

## Code Architecture

The codebase follows a layered architecture:

1. **Models (Data Access Layer)**: Handle all database operations
2. **Services (Business Logic Layer)**: Contain business logic and validation
3. **Controllers (Presentation Layer)**: Handle HTTP requests and responses
4. **Routes**: Define API endpoints
5. **Middleware**: Handle cross-cutting concerns (error handling, logging)

## Best Practices Implemented

- ✅ Separation of concerns (Models, Services, Controllers)
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Consistent API response format
- ✅ Database connection pooling
- ✅ Proper HTTP status codes
- ✅ Request logging
- ✅ Environment variable configuration
- ✅ SQL injection prevention (parameterized queries)
- ✅ Conflict detection for timetable slots

## Dependencies

- **express**: Web framework
- **mysql2**: MySQL database driver
- **bcryptjs**: Password hashing
- **dotenv**: Environment variable management
- **nodemon**: Development server (dev dependency)

## License

This project is part of the ITUM Timetable Management System.

