import * as roomModel from '../models/room.model.js';

/**
 * Room Service - Business Logic Layer for Rooms
 */

export const createRoom = async (roomData) => {
  // Validate required fields
  if (!roomData.room_name || !roomData.room_type) {
    throw new Error('Missing required fields: room_name, room_type');
  }

  // Validate room type
  const validRoomTypes = ['LECTURE_HALL', 'LAB', 'SEMINAR', 'STUDIO', 'OFFICE'];
  if (!validRoomTypes.includes(roomData.room_type.toUpperCase())) {
    throw new Error('Invalid room type. Must be one of: LECTURE_HALL, LAB, SEMINAR, STUDIO, OFFICE');
  }

  roomData.room_type = roomData.room_type.toUpperCase();

  // Check if room name already exists
  const existingRoom = await roomModel.getRoomByName(roomData.room_name);
  if (existingRoom) {
    throw new Error('Room with this name already exists');
  }

  // Validate capacity if provided
  if (roomData.capacity !== undefined && roomData.capacity < 1) {
    throw new Error('Capacity must be at least 1');
  }

  return await roomModel.createRoom(roomData);
};

export const getRoomById = async (id) => {
  if (!id) {
    throw new Error('Room ID is required');
  }
  const room = await roomModel.getRoomById(id);
  if (!room) {
    throw new Error('Room not found');
  }
  return room;
};

export const getRoomByName = async (roomName) => {
  if (!roomName) {
    throw new Error('Room name is required');
  }
  return await roomModel.getRoomByName(roomName);
};

export const getAllRooms = async (filters = {}) => {
  return await roomModel.getAllRooms(filters);
};

export const getAvailableRooms = async (day, startTime, endTime) => {
  if (!day || !startTime || !endTime) {
    throw new Error('Day, start time, and end time are required');
  }

  // Validate day
  const validDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  if (!validDays.includes(day.toUpperCase())) {
    throw new Error('Invalid day');
  }

  // Validate time format (HH:MM:SS)
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    throw new Error('Invalid time format. Use HH:MM:SS');
  }

  // Validate that start time is before end time
  if (startTime >= endTime) {
    throw new Error('Start time must be before end time');
  }

  return await roomModel.getAvailableRooms(day.toUpperCase(), startTime, endTime);
};

export const updateRoom = async (id, roomData) => {
  if (!id) {
    throw new Error('Room ID is required');
  }

  // Check if room exists
  const existingRoom = await roomModel.getRoomById(id);
  if (!existingRoom) {
    throw new Error('Room not found');
  }

  // Validate room type if provided
  if (roomData.room_type) {
    const validRoomTypes = ['LECTURE_HALL', 'LAB', 'SEMINAR', 'STUDIO', 'OFFICE'];
    if (!validRoomTypes.includes(roomData.room_type.toUpperCase())) {
      throw new Error('Invalid room type. Must be one of: LECTURE_HALL, LAB, SEMINAR, STUDIO, OFFICE');
    }
    roomData.room_type = roomData.room_type.toUpperCase();
  }

  // Validate room name if provided
  if (roomData.room_name) {
    const roomWithName = await roomModel.getRoomByName(roomData.room_name);
    if (roomWithName && roomWithName.id !== parseInt(id)) {
      throw new Error('Room name already taken by another room');
    }
  }

  // Validate capacity if provided
  if (roomData.capacity !== undefined && roomData.capacity < 1) {
    throw new Error('Capacity must be at least 1');
  }

  const updatedRoom = await roomModel.updateRoom(id, roomData);
  if (!updatedRoom) {
    throw new Error('Failed to update room');
  }
  return updatedRoom;
};

export const deleteRoom = async (id) => {
  if (!id) {
    throw new Error('Room ID is required');
  }

  const room = await roomModel.getRoomById(id);
  if (!room) {
    throw new Error('Room not found');
  }

  // TODO: Check if room has associated timetable slots before deleting

  return await roomModel.deleteRoom(id);
};
