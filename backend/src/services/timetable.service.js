import * as timetableModel from '../models/timetable.model.js';
import * as moduleModel from '../models/module.model.js';
import * as userModel from '../models/user.model.js';
import * as roomModel from '../models/room.model.js';

/**
 * Timetable Service - Business Logic Layer for Timetable
 */

export const createTimetableSlot = async (slotData) => {
  // Validate required fields
  if (!slotData.module_id || !slotData.instructor_id || !slotData.room_id || 
      !slotData.day || !slotData.start_time || !slotData.end_time) {
    throw new Error('Missing required fields: module_id, instructor_id, room_id, day, start_time, end_time');
  }

  // Validate day
  const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  if (!validDays.includes(slotData.day.toUpperCase())) {
    throw new Error('Invalid day. Must be one of: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY');
  }
  slotData.day = slotData.day.toUpperCase();

  // Validate time format
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (!timeRegex.test(slotData.start_time) || !timeRegex.test(slotData.end_time)) {
    throw new Error('Invalid time format. Use HH:MM:SS');
  }

  // Validate that start time is before end time
  if (slotData.start_time >= slotData.end_time) {
    throw new Error('Start time must be before end time');
  }

  // Validate session type if provided
  if (slotData.session_type) {
    const validSessionTypes = ['LECTURE', 'LAB', 'TUTORIAL', 'SEMINAR', 'EXAM'];
    if (!validSessionTypes.includes(slotData.session_type.toUpperCase())) {
      throw new Error('Invalid session type. Must be one of: LECTURE, LAB, TUTORIAL, SEMINAR, EXAM');
    }
    slotData.session_type = slotData.session_type.toUpperCase();
  } else {
    slotData.session_type = 'LECTURE';
  }

  // Validate that module exists
  const module = await moduleModel.getModuleById(slotData.module_id);
  if (!module) {
    throw new Error('Module not found');
  }

  // Validate that instructor exists and is faculty
  const instructor = await userModel.getUserById(slotData.instructor_id);
  if (!instructor) {
    throw new Error('Instructor not found');
  }
  if (instructor.role !== 'FACULTY' && instructor.role !== 'ADMIN') {
    throw new Error('Instructor must be a faculty member or admin');
  }

  // Validate that room exists
  const room = await roomModel.getRoomById(slotData.room_id);
  if (!room) {
    throw new Error('Room not found');
  }

  // Check for room conflicts
  const roomConflicts = await timetableModel.findConflicts(
    slotData.day,
    slotData.room_id,
    slotData.start_time,
    slotData.end_time
  );
  if (roomConflicts.length > 0) {
    throw new Error('Room conflict: Room is already occupied at this time');
  }

  // Check for instructor conflicts
  const instructorConflicts = await timetableModel.findInstructorConflicts(
    slotData.instructor_id,
    slotData.day,
    slotData.start_time,
    slotData.end_time
  );
  if (instructorConflicts.length > 0) {
    throw new Error('Instructor conflict: Instructor is already scheduled at this time');
  }

  return await timetableModel.createSlot(slotData);
};

export const getSlotById = async (id) => {
  if (!id) {
    throw new Error('Slot ID is required');
  }
  const slot = await timetableModel.getSlotById(id);
  if (!slot) {
    throw new Error('Timetable slot not found');
  }
  return slot;
};

export const getWeeklyTimetable = async (filters = {}) => {
  return await timetableModel.getWeeklyTimetable(filters);
};

export const getTimetableByInstructor = async (instructorId) => {
  if (!instructorId) {
    throw new Error('Instructor ID is required');
  }

  const instructor = await userModel.getUserById(instructorId);
  if (!instructor) {
    throw new Error('Instructor not found');
  }

  return await timetableModel.getTimetableByInstructor(instructorId);
};

export const getTimetableByModule = async (moduleId) => {
  if (!moduleId) {
    throw new Error('Module ID is required');
  }

  const module = await moduleModel.getModuleById(moduleId);
  if (!module) {
    throw new Error('Module not found');
  }

  return await timetableModel.getTimetableByModule(moduleId);
};

export const updateTimetableSlot = async (id, slotData) => {
  if (!id) {
    throw new Error('Slot ID is required');
  }

  // Check if slot exists
  const existingSlot = await timetableModel.getSlotById(id);
  if (!existingSlot) {
    throw new Error('Timetable slot not found');
  }

  // Validate day if provided
  if (slotData.day) {
    const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    if (!validDays.includes(slotData.day.toUpperCase())) {
      throw new Error('Invalid day');
    }
    slotData.day = slotData.day.toUpperCase();
  }

  // Validate time format if provided
  if (slotData.start_time || slotData.end_time) {
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    const startTime = slotData.start_time || existingSlot.start_time;
    const endTime = slotData.end_time || existingSlot.end_time;

    if (slotData.start_time && !timeRegex.test(slotData.start_time)) {
      throw new Error('Invalid start time format. Use HH:MM:SS');
    }
    if (slotData.end_time && !timeRegex.test(slotData.end_time)) {
      throw new Error('Invalid end time format. Use HH:MM:SS');
    }
    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }
  }

  // Validate session type if provided
  if (slotData.session_type) {
    const validSessionTypes = ['LECTURE', 'LAB', 'TUTORIAL', 'SEMINAR', 'EXAM'];
    if (!validSessionTypes.includes(slotData.session_type.toUpperCase())) {
      throw new Error('Invalid session type');
    }
    slotData.session_type = slotData.session_type.toUpperCase();
  }

  // Validate module if provided
  if (slotData.module_id) {
    const module = await moduleModel.getModuleById(slotData.module_id);
    if (!module) {
      throw new Error('Module not found');
    }
  }

  // Validate instructor if provided
  if (slotData.instructor_id) {
    const instructor = await userModel.getUserById(slotData.instructor_id);
    if (!instructor) {
      throw new Error('Instructor not found');
    }
    if (instructor.role !== 'FACULTY' && instructor.role !== 'ADMIN') {
      throw new Error('Instructor must be a faculty member or admin');
    }
  }

  // Validate room if provided
  if (slotData.room_id) {
    const room = await roomModel.getRoomById(slotData.room_id);
    if (!room) {
      throw new Error('Room not found');
    }
  }

  // Check for conflicts if time/room/day changed
  const day = slotData.day || existingSlot.day;
  const roomId = slotData.room_id || existingSlot.room_id;
  const startTime = slotData.start_time || existingSlot.start_time;
  const endTime = slotData.end_time || existingSlot.end_time;
  const instructorId = slotData.instructor_id || existingSlot.instructor_id;

  // Check room conflicts
  const roomConflicts = await timetableModel.findConflicts(
    day,
    roomId,
    startTime,
    endTime,
    id
  );
  if (roomConflicts.length > 0) {
    throw new Error('Room conflict: Room is already occupied at this time');
  }

  // Check instructor conflicts
  const instructorConflicts = await timetableModel.findInstructorConflicts(
    instructorId,
    day,
    startTime,
    endTime,
    id
  );
  if (instructorConflicts.length > 0) {
    throw new Error('Instructor conflict: Instructor is already scheduled at this time');
  }

  const updatedSlot = await timetableModel.updateSlot(id, slotData);
  if (!updatedSlot) {
    throw new Error('Failed to update timetable slot');
  }
  return updatedSlot;
};

export const deleteTimetableSlot = async (id) => {
  if (!id) {
    throw new Error('Slot ID is required');
  }

  const slot = await timetableModel.getSlotById(id);
  if (!slot) {
    throw new Error('Timetable slot not found');
  }

  return await timetableModel.deleteSlot(id);
};
