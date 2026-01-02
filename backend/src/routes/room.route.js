import express from 'express';
import {
  createRoom,
  getRoomById,
  getAllRooms,
  getAvailableRooms,
  updateRoom,
  deleteRoom
} from '../controllers/room.controller.js';

const router = express.Router();

// Room CRUD routes
router.post('/', createRoom);
router.get('/', getAllRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);

export default router;
