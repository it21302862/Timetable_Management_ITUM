# Timetable Management System - Frontend

Modern React-based frontend for ITUM University Timetable Management System.

## Features

### 📅 Timetable View
- **Weekly Grid Display**: View timetable in a clean weekly grid format (Monday-Friday)
- **Color-Coded Sessions**: Different colors for different session types:
  - 🔵 **Blue** - Lecture/Theory
  - 🟢 **Green** - Lab/Practical
  - 🟣 **Purple** - Tutorial
  - 🟠 **Orange** - Seminar
  - 🔴 **Red** - Exam
- **Time Slots**: Displays classes from 9:00 AM to 6:00 PM with break time highlighted
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🔍 Search & Filter Options
- **Week Date Picker**: Select any week to view its timetable
- **Day Filter**: Filter by specific day (Monday, Tuesday, etc.)
- **Instructor Filter**: View timetable for specific instructor
- **Module Filter**: View timetable for specific module
- **Room Filter**: View timetable for specific room
- **Reset Filters**: Clear all filters with one click

### 📊 Statistics Dashboard
- Total number of timetable slots
- Number of unique modules
- Number of unique instructors
- Number of rooms used

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the next available port).

### Production Build
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```

## Configuration

### API Configuration
The API base URL is configured in `src/api/api.js`. By default, it points to:
```
http://localhost:5000/api
```

Make sure your backend server is running on port 5000, or update the base URL accordingly.

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── api.js          # Axios configuration
│   ├── components/
│   │   └── Navbar.jsx      # Navigation component
│   ├── pages/
│   │   ├── Timetable.jsx   # Main timetable page
│   │   ├── Modules.jsx     # Modules management page
│   │   ├── Rooms.jsx       # Rooms management page
│   │   └── Users.jsx       # Users management page
│   ├── App.jsx             # Main app component with routes
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                  # Static assets
└── package.json            # Dependencies
```

## Usage

### Viewing Timetable

1. Navigate to the Timetable page (default route)
2. Use the week date picker to select a specific week
3. Use filters to narrow down the view:
   - Select a day to see only that day's schedule
   - Select an instructor to see their schedule
   - Select a module to see all sessions for that module
   - Select a room to see all classes in that room

### Understanding the Display

- Each cell in the timetable grid shows:
  - **Module Code** (e.g., CS101)
  - **Session Type** (Theory, Practical, Tutorial, etc.)
  - **Room Name** (e.g., LH101)
  - **Instructor Name**

- Hover over a cell to see full details in a tooltip
- Empty cells show "-" indicating no class scheduled
- Break time (11:00-11:30 AM) is highlighted in red

## Features in Detail

### Color Coding
- **Lecture (Theory)**: Blue background - Regular classroom sessions
- **Lab (Practical)**: Green background - Hands-on practical sessions
- **Tutorial**: Purple background - Small group tutorial sessions
- **Seminar**: Orange background - Seminar-style sessions
- **Exam**: Red background - Examination sessions

### Week Navigation
- Select any date using the week date picker
- The timetable automatically shows the week containing that date
- Week starts on Monday and ends on Friday

### Filtering
- All filters work together (AND logic)
- For example: Day=Monday + Instructor=Dr. Smith shows only Dr. Smith's Monday classes
- Use "Reset Filters" to clear all filters and see the full timetable

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- The timetable component fetches data from the backend API
- All API calls are handled through the `api.js` file
- Error handling is implemented for failed API requests
- Loading states are shown while data is being fetched

## Troubleshooting

### API Connection Issues
- Ensure the backend server is running on port 5000
- Check CORS settings in the backend
- Verify the API base URL in `src/api/api.js`

### No Data Displayed
- Check browser console for errors
- Verify backend API endpoints are working
- Ensure database has timetable data

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check that `index.css` imports Tailwind directives
- Verify `tailwind.config.js` is present

## License

This project is part of the ITUM Timetable Management System.
