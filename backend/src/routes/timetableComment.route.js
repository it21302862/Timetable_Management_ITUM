import express from 'express';
import {
  addComment,
  getCommentsForSlot,
  updateCommentStatus,
  deleteComment
} from '../controllers/timetableComment.controller.js';

const router = express.Router();

// Create comment or reply
router.post('/', addComment);

// Get all comments for a timetable slot
router.get('/slot/:slotId', getCommentsForSlot);

// Update comment status (OPEN / RESOLVED / CANCELLED)
router.put('/:id/status', updateCommentStatus);

// Delete comment
router.delete('/:id', deleteComment);

export default router;


