# Database Sample Data Insertion Guide

## Quick Start

1. **First, run the schema:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Then, insert sample data:**
   ```bash
   mysql -u root -p < database/insert_sample_data.sql
   ```

## Important Notes

### Password Hashing
The sample data includes placeholder bcrypt hashes. For production or proper testing, you should:

1. **Use the API to create users** (recommended):
   ```bash
   POST /api/users
   {
     "name": "Admin User",
     "email": "admin@itum.edu",
     "password": "your_password",
     "role": "ADMIN"
   }
   ```

2. **Or generate proper bcrypt hashes** using Node.js:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = bcrypt.hashSync('password123', 10);
   console.log(hash);
   ```

### Default Test Password
All sample users in the SQL file use the placeholder hash. For testing, you can:
- Create users via the API (passwords will be properly hashed)
- Or update the password hashes in the SQL file with real bcrypt hashes

## Sample Data Summary

### Users
- **2 Admin users**
- **8 Faculty users** (instructors)
- **3 Student users**

### Modules
- **15 modules** across different subjects:
  - Computer Science (CS101, CS201, CS301, CS302, CS401, CS402)
  - Mathematics (MATH101, MATH201)
  - Physics (PHYS101, PHYS201)
  - English (ENG101, ENG201)
  - Networking (NET101, NET201)
  - Artificial Intelligence (AI101)

### Rooms
- **5 Lecture Halls** (capacity 80-200)
- **7 Labs** (capacity 25-40)
- **4 Seminar Rooms** (capacity 20-30)
- **2 Studios** (capacity 15-20)
- **4 Offices** (capacity 1)

### Timetable Slots
- **40+ timetable entries** covering Monday to Friday
- Mix of LECTURE, LAB, TUTORIAL, SEMINAR session types
- Proper scheduling with no conflicts

## Verification

After inserting data, verify with:

```sql
-- Check counts
SELECT 'Users' as TableName, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Modules', COUNT(*) FROM modules
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms
UNION ALL
SELECT 'Timetable Slots', COUNT(*) FROM timetable_slots;
```

## Customization

You can modify the `insert_sample_data.sql` file to:
- Add more users, modules, rooms
- Adjust timetable schedules
- Change room capacities
- Add more timetable slots

Make sure to maintain foreign key relationships when adding data.

