import express from 'express';
import {
  createSlot,
  getSlotById,
  getWeeklyTimetable,
  getTimetableByInstructor,
  getTimetableByModule,
  updateSlot,
  deleteSlot
} from '../controllers/timetable.controller.js';

const router = express.Router();

// Timetable CRUD routes
router.post('/', createSlot);
router.get('/', getWeeklyTimetable);
router.get('/instructor/:instructorId', getTimetableByInstructor);
router.get('/module/:moduleId', getTimetableByModule);
router.get('/:id', getSlotById);
router.put('/:id', updateSlot);
router.delete('/:id', deleteSlot);

export default router;
