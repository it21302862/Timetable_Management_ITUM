import * as timetableService from '../services/timetable.service.js';

/**
 * Timetable Controller - HTTP Request/Response Handling
 */

export const createSlot = async (req, res, next) => {
  try {
    const slot = await timetableService.createTimetableSlot(req.body);
    res.status(201).json({
      success: true,
      message: 'Timetable slot created successfully',
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

export const getSlotById = async (req, res, next) => {
  try {
    const slot = await timetableService.getSlotById(req.params.id);
    res.status(200).json({
      success: true,
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyTimetable = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.day) {
      filters.day = req.query.day;
    }
    if (req.query.instructor_id) {
      filters.instructor_id = req.query.instructor_id;
    }
    if (req.query.module_id) {
      filters.module_id = req.query.module_id;
    }
    if (req.query.room_id) {
      filters.room_id = req.query.room_id;
    }
    const timetable = await timetableService.getWeeklyTimetable(filters);
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

export const getTimetableByInstructor = async (req, res, next) => {
  try {
    const timetable = await timetableService.getTimetableByInstructor(req.params.instructorId);
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

export const getTimetableByModule = async (req, res, next) => {
  try {
    const timetable = await timetableService.getTimetableByModule(req.params.moduleId);
    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    next(error);
  }
};

export const updateSlot = async (req, res, next) => {
  try {
    const slot = await timetableService.updateTimetableSlot(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Timetable slot updated successfully',
      data: slot
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSlot = async (req, res, next) => {
  try {
    await timetableService.deleteTimetableSlot(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Timetable slot deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
