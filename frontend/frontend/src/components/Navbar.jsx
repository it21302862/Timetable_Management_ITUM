import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold">
              ITUM Timetable
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/timetable"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/timetable')}`}
            >
              Timetable
            </Link>
            <Link
              to="/modules"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/modules')}`}
            >
              Modules
            </Link>
            <Link
              to="/rooms"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/rooms')}`}
            >
              Rooms
            </Link>
            <Link
              to="/users"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/users')}`}
            >
              Users
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
