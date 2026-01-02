import * as roomService from '../services/room.service.js';

/**
 * Room Controller - HTTP Request/Response Handling
 */

export const createRoom = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRooms = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.room_type) {
      filters.room_type = req.query.room_type;
    }
    if (req.query.building) {
      filters.building = req.query.building;
    }
    if (req.query.min_capacity) {
      filters.min_capacity = parseInt(req.query.min_capacity);
    }
    const rooms = await roomService.getAllRooms(filters);
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailableRooms = async (req, res, next) => {
  try {
    const { day, start_time, end_time } = req.query;
    if (!day || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Day, start_time, and end_time are required'
      });
    }
    const rooms = await roomService.getAvailableRooms(day, start_time, end_time);
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
