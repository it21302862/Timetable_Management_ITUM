import { useState, useEffect } from 'react';
import api from '../api/api';

const SESSION_COLORS = {
  LECTURE: 'bg-blue-100 border-blue-300 text-blue-800',
  LAB: 'bg-green-100 border-green-300 text-green-800',
  TUTORIAL: 'bg-purple-100 border-purple-300 text-purple-800',
  SEMINAR: 'bg-orange-100 border-orange-300 text-orange-800',
  EXAM: 'bg-red-100 border-red-300 text-red-800',
};

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export default function Timetable() {
  const [timetableData, setTimetableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // Filter states
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [weekDate, setWeekDate] = useState('');
  
  // Unique values for filters
  const [instructors, setInstructors] = useState([]);
  const [modules, setModules] = useState([]);
  const [rooms, setRooms] = useState([]);

  // State for creating a new slot
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [slotBeingAdded, setSlotBeingAdded] = useState(null); // { day, timeSlot }
  const [newSlotModuleId, setNewSlotModuleId] = useState('');
  const [newSlotInstructorId, setNewSlotInstructorId] = useState('');
  const [newSlotRoomId, setNewSlotRoomId] = useState('');
  const [newSlotSessionType, setNewSlotSessionType] = useState('LECTURE');

  // Comment state
  const [users, setUsers] = useState([]);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentSlot, setCommentSlot] = useState(null); // timetableSlot object
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [commentAuthorId, setCommentAuthorId] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);

  // Get current week dates
  const getWeekDates = (dateString) => {
    if (!dateString) {
      const today = new Date();
      dateString = today.toISOString().split('T')[0];
    }
    
    const date = new Date(dateString);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(date.setDate(diff));
    
    const weekDates = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push({
        date: d.toISOString().split('T')[0],
        dayName: DAYS_OF_WEEK[i],
        displayDate: d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
      });
    }
    return weekDates;
  };

  const [weekDates, setWeekDates] = useState(getWeekDates(''));

  // Generate time slots (9 AM to 6 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      if (hour === 11) {
        // Add break slot
        slots.push({
          time: '11:00:00',
          endTime: '11:30:00',
          display: '11:00 AM - 11:30 AM',
          isBreak: true
        });
        slots.push({
          time: '11:30:00',
          endTime: '12:30:00',
          display: '11:30 AM - 12:30 PM',
          isBreak: false
        });
      } else if (hour === 12) {
        // Skip 12 since we already added 11:30-12:30
        continue;
      } else {
        const nextHour = hour + 1;
        const timeStr = `${hour.toString().padStart(2, '0')}:00:00`;
        const endTimeStr = `${nextHour.toString().padStart(2, '0')}:00:00`;
        const display = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'} - ${nextHour > 12 ? nextHour - 12 : nextHour}:00 ${nextHour >= 12 ? 'PM' : 'AM'}`;
        slots.push({
          time: timeStr,
          endTime: endTimeStr,
          display,
          isBreak: false
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Fetch timetable data
  useEffect(() => {
    fetchTimetable();
  }, []);

  // Fetch modules and instructors for filters
  useEffect(() => {
    fetchModules();
    fetchInstructors();
    fetchRooms();
    fetchUsers();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/timetable');
      if (response.data.success) {
        setTimetableData(response.data.data || []);
        setFilteredData(response.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch timetable');
      console.error('Error fetching timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await api.get('/modules');
      if (response.data.success) {
        setModules(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await api.get('/users?role=ADMIN');
      if (response.data.success) {
        setInstructors(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      if (response.data.success) {
        setRooms(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  // Filter timetable data
  useEffect(() => {
    let filtered = [...timetableData];

    if (selectedDay) {
      filtered = filtered.filter(
        (item) => (item.day || '').toUpperCase() === selectedDay
      );
    }

    if (selectedInstructor) {
      const instructorId = Number(selectedInstructor);
      filtered = filtered.filter(
        (item) => Number(item.instructor_id) === instructorId
      );
    }

    if (selectedModule) {
      const moduleId = Number(selectedModule);
      filtered = filtered.filter(
        (item) => Number(item.module_id) === moduleId
      );
    }

    if (selectedRoom) {
      const roomId = Number(selectedRoom);
      filtered = filtered.filter(
        (item) => Number(item.room_id) === roomId
      );
    }

    setFilteredData(filtered);
  }, [selectedDay, selectedInstructor, selectedModule, selectedRoom, timetableData]);

  // Handle week date change
  const handleWeekDateChange = (e) => {
    const date = e.target.value;
    setWeekDate(date);
    if (date) {
      setWeekDates(getWeekDates(date));
    }
  };

  // Reset filters
  const handleReset = () => {
    setSelectedDay('');
    setSelectedInstructor('');
    setSelectedModule('');
    setSelectedRoom('');
    setWeekDate('');
    setWeekDates(getWeekDates(''));
    setFilteredData(timetableData);
  };

  // Get slots for a specific day and time
  const getSlotsForDayAndTime = (day, timeSlot) => {
    return filteredData.filter(slot => {
      if (slot.day !== day) return false;
      
      // Convert time strings to comparable format
      const slotStart = slot.start_time;
      const slotEnd = slot.end_time;
      const cellStart = timeSlot.time;
      const cellEnd = timeSlot.endTime;
      
      // Check if slot overlaps with the cell time range
      // Slot overlaps if: slotStart < cellEnd AND slotEnd > cellStart
      return slotStart < cellEnd && slotEnd > cellStart;
    });
  };

  const openAddSlotModal = (day, timeSlot) => {
    setSlotBeingAdded({ day, timeSlot });
    setNewSlotModuleId('');
    setNewSlotInstructorId('');
    setNewSlotRoomId('');
    setNewSlotSessionType('LECTURE');
    setIsAddModalOpen(true);
  };

  const closeAddSlotModal = () => {
    if (saving) return;
    setIsAddModalOpen(false);
    setSlotBeingAdded(null);
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!slotBeingAdded) return;

    try {
      setSaving(true);
      await api.post('/timetable', {
        module_id: Number(newSlotModuleId),
        instructor_id: Number(newSlotInstructorId),
        room_id: Number(newSlotRoomId),
        day: slotBeingAdded.day,
        start_time: slotBeingAdded.timeSlot.time,
        end_time: slotBeingAdded.timeSlot.endTime,
        session_type: newSlotSessionType
      });

      await fetchTimetable();
      closeAddSlotModal();
    } catch (err) {
      // Surface backend validation message if available
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to create timetable slot');
      console.error('Error creating timetable slot:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    const confirmed = window.confirm('Are you sure you want to delete this timetable slot?');
    if (!confirmed) return;

    try {
      setSaving(true);
      await api.delete(`/timetable/${slotId}`);
      await fetchTimetable();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to delete timetable slot');
      console.error('Error deleting timetable slot:', err);
    } finally {
      setSaving(false);
    }
  };

  const openCommentsModal = async (timetableSlot) => {
    setCommentSlot(timetableSlot);
    setIsCommentModalOpen(true);
    setNewCommentText('');
    setReplyToCommentId(null);

    // pre-select an author if not set
    if (!commentAuthorId && users.length > 0) {
      const nonStudent = users.find((u) => u.role !== 'STUDENT') || users[0];
      setCommentAuthorId(nonStudent.id);
    }

    try {
      setCommentsLoading(true);
      const res = await api.get(`/timetable-comments/slot/${timetableSlot.id}`);
      if (res.data.success) {
        setComments(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      alert(err.response?.data?.message || 'Failed to load comments');
    } finally {
      setCommentsLoading(false);
    }
  };

  const closeCommentsModal = () => {
    setIsCommentModalOpen(false);
    setCommentSlot(null);
    setComments([]);
    setNewCommentText('');
    setReplyToCommentId(null);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentSlot || !commentAuthorId || !newCommentText.trim()) return;

    try {
      setSaving(true);
      await api.post('/timetable-comments', {
        timetable_slot_id: commentSlot.id,
        author_id: Number(commentAuthorId),
        message: newCommentText.trim(),
        parent_comment_id: replyToCommentId
      });

      setNewCommentText('');
      setReplyToCommentId(null);

      const res = await api.get(`/timetable-comments/slot/${commentSlot.id}`);
      if (res.data.success) {
        setComments(res.data.data || []);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSaving(false);
    }
  };

  const handleReplyClick = (commentId) => {
    setReplyToCommentId(commentId);
  };

  const groupedComments = comments.reduce(
    (acc, c) => {
      if (c.parent_comment_id) {
        acc.children[c.parent_comment_id] = acc.children[c.parent_comment_id] || [];
        acc.children[c.parent_comment_id].push(c);
      } else {
        acc.roots.push(c);
      }
      return acc;
    },
    { roots: [], children: {} }
  );

  // Format session type for display
  const formatSessionType = (type) => {
    const typeMap = {
      'LECTURE': 'Lecture',
      'LAB': 'Practical',
      'TUTORIAL': 'Tutorial',
      'SEMINAR': 'Seminar',
      'EXAM': 'Exam'
    };
    return typeMap[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading timetable...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Timetable Management</h1>
          
          {/* Search and Filter Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Week Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Week Date
              </label>
              <input
                type="date"
                value={weekDate}
                onChange={handleWeekDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Day Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Days</option>
                {DAYS_OF_WEEK.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            {/* Instructor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor
              </label>
              <select
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Instructors</option>
                {instructors.map(instructor => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Module Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Module
              </label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Modules</option>
                {modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.module_code} - {module.module_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Rooms</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.room_name} ({room.building})
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold sticky left-0 bg-gray-800 z-10 min-w-[200px]">
                    Class Timing
                  </th>
                  {weekDates.map((weekDay, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-3 text-center font-semibold min-w-[250px]">
                      <div>{weekDay.dayName}</div>
                      <div className="text-sm font-normal">{weekDay.displayDate}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, slotIndex) => (
                  <tr key={slotIndex} className="hover:bg-gray-50">
                    <td className={`border border-gray-300 px-4 py-3 font-medium sticky left-0 bg-white z-10 ${slot.isBreak ? 'bg-red-50 text-red-600 font-bold' : ''}`}>
                      {slot.display}
                    </td>
                    {weekDates.map((weekDay, dayIndex) => {
                      if (slot.isBreak) {
                        return (
                          <td key={dayIndex} className="border border-gray-300 px-2 py-2 bg-red-50 text-center text-red-600 font-bold">
                            Break
                          </td>
                        );
                      }
                      
                      const slotsForThisCell = getSlotsForDayAndTime(weekDay.dayName, slot);
                      
                      return (
                        <td key={dayIndex} className="border border-gray-300 px-2 py-2 align-top">
                          {slotsForThisCell.length > 0 ? (
                            <div className="space-y-1">
                              {slotsForThisCell.map((timetableSlot, idx) => (
                                <div
                                  key={idx}
                                  className={`relative p-2 rounded border-2 ${SESSION_COLORS[timetableSlot.session_type] || 'bg-gray-100 border-gray-300'} cursor-pointer hover:shadow-md transition-shadow`}
                                  title={`${timetableSlot.module_code} - ${timetableSlot.module_name}\n${formatSessionType(timetableSlot.session_type)}\nInstructor: ${timetableSlot.instructor_name}\nRoom: ${timetableSlot.room_name}`}
                                >
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 text-xs font-bold text-red-600 hover:text-red-800"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSlot(timetableSlot.id);
                                    }}
                                  >
                                    ×
                                  </button>
                                  <div className="font-semibold text-sm">
                                    {timetableSlot.module_code}
                                  </div>
                                  <div className="text-xs mt-1">
                                    {formatSessionType(timetableSlot.session_type)}
                                  </div>
                                  <div className="text-xs mt-1 font-medium">
                                    Room: {timetableSlot.room_name}
                                  </div>
                                  {timetableSlot.instructor_name && (
                                    <div className="text-xs mt-1 text-gray-600">
                                      {timetableSlot.instructor_name}
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openCommentsModal(timetableSlot);
                                    }}
                                    className="mt-2 inline-flex items-center text-[10px] text-blue-700 hover:text-blue-900"
                                  >
                                    💬 <span className="ml-1">Comments</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => openAddSlotModal(weekDay.dayName, slot)}
                              className="w-full flex flex-col items-center justify-center py-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors text-xs"
                            >
                              <span className="flex items-center justify-center w-6 h-6 border border-dashed border-gray-400 rounded-full mb-1">
                                +
                              </span>
                              <span>Add slot</span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Session Type Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(SESSION_COLORS).map(([type, colorClass]) => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded border-2 ${colorClass}`}></div>
                <span className="text-sm">{formatSessionType(type)}</span>
              </div>
            ))}
          </div>
        </div>

      {/* Add Slot Modal */}
      {isAddModalOpen && slotBeingAdded && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Add Timetable Slot</h2>
              <button
                type="button"
                onClick={closeAddSlotModal}
                className="text-gray-500 hover:text-gray-800 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateSlot} className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day
                  </label>
                  <input
                    type="text"
                    value={slotBeingAdded.day}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={slotBeingAdded.timeSlot.display}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Module
                  </label>
                  <select
                    required
                    value={newSlotModuleId}
                    onChange={(e) => setNewSlotModuleId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select module</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.module_code} - {module.module_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor
                  </label>
                  <select
                    required
                    value={newSlotInstructorId}
                    onChange={(e) => setNewSlotInstructorId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select instructor</option>
                    {instructors.map((instructor) => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room
                  </label>
                  <select
                    required
                    value={newSlotRoomId}
                    onChange={(e) => setNewSlotRoomId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.room_name} ({room.building})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type
                  </label>
                  <select
                    value={newSlotSessionType}
                    onChange={(e) => setNewSlotSessionType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="LECTURE">Lecture</option>
                    <option value="LAB">Practical (Lab)</option>
                    <option value="TUTORIAL">Tutorial</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="EXAM">Exam</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeAddSlotModal}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-60"
                  disabled={
                    saving ||
                    !newSlotModuleId ||
                    !newSlotInstructorId ||
                    !newSlotRoomId
                  }
                >
                  {saving ? 'Saving...' : 'Save Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {isCommentModalOpen && commentSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Comments for {commentSlot.module_code}</h2>
                <p className="text-xs text-gray-500">
                  {formatSessionType(commentSlot.session_type)} • {commentSlot.day} •{' '}
                  {commentSlot.start_time?.slice(0, 5)} - {commentSlot.end_time?.slice(0, 5)} •{' '}
                  Room {commentSlot.room_name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCommentsModal}
                className="text-gray-500 hover:text-gray-800 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {commentsLoading ? (
                <div className="text-sm text-gray-500">Loading comments...</div>
              ) : groupedComments.roots.length === 0 ? (
                <div className="text-sm text-gray-500">No comments yet. Be the first to comment.</div>
              ) : (
                groupedComments.roots.map((c) => (
                  <div key={c.id} className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">
                        {c.author_name}{' '}
                        <span className="ml-2 text-[11px] uppercase text-gray-500">
                          {c.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">
                      {c.message}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReplyClick(c.id)}
                      className="mt-2 text-[11px] text-blue-700 hover:text-blue-900"
                    >
                      Reply
                    </button>

                    {groupedComments.children[c.id] &&
                      groupedComments.children[c.id].map((child) => (
                        <div
                          key={child.id}
                          className="mt-3 ml-4 border-l-2 border-gray-200 pl-3 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">
                              {child.author_name}{' '}
                              <span className="ml-2 text-[11px] uppercase text-gray-500">
                                {child.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {new Date(child.created_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-1 text-gray-800 whitespace-pre-wrap">
                            {child.message}
                          </div>
                        </div>
                      ))}
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="border-t px-6 py-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Author
                  </label>
                  <select
                    required
                    value={commentAuthorId}
                    onChange={(e) => setCommentAuthorId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select user</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Replying To
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      replyToCommentId
                        ? `Comment #${replyToCommentId}`
                        : 'New top-level comment'
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-xs text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  required
                  rows={3}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the reason for requesting this slot or add a reply..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeCommentsModal}
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm"
                  disabled={saving}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-60"
                  disabled={saving || !commentAuthorId || !newCommentText.trim()}
                >
                  {saving ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
            <div className="text-sm text-gray-600">Total Slots</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-green-600">
              {new Set(filteredData.map(s => s.module_id)).size}
            </div>
            <div className="text-sm text-gray-600">Modules</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(filteredData.map(s => s.instructor_id)).size}
            </div>
            <div className="text-sm text-gray-600">Instructors</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(filteredData.map(s => s.room_id)).size}
            </div>
            <div className="text-sm text-gray-600">Rooms Used</div>
          </div>
        </div>
      </div>
    </div>
  );
}

