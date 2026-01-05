import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Rooms from './pages/Rooms';
import Modules from './pages/Modules';
import Users from './pages/Users';
import Timetable from './pages/Timetable';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/timetable" replace />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

