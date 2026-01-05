import * as commentModel from '../models/timetableComment.model.js';
import * as timetableModel from '../models/timetable.model.js';
import * as userModel from '../models/user.model.js';

/**
 * Timetable Comment Service - Business Logic for comments
 */

export const addComment = async (data) => {
  const { timetable_slot_id, author_id, message, parent_comment_id } = data;

  if (!timetable_slot_id || !author_id || !message) {
    throw new Error('Missing required fields: timetable_slot_id, author_id, message');
  }

  // Ensure slot exists
  const slot = await timetableModel.getSlotById(timetable_slot_id);
  if (!slot) {
    throw new Error('Timetable slot not found');
  }

  // Ensure author exists
  const author = await userModel.getUserById(author_id);
  if (!author) {
    throw new Error('Author not found');
  }

  // If reply, ensure parent comment exists and belongs to same slot
  if (parent_comment_id) {
    const parent = await commentModel.getCommentById(parent_comment_id);
    if (!parent) {
      throw new Error('Parent comment not found');
    }
    if (Number(parent.timetable_slot_id) !== Number(timetable_slot_id)) {
      throw new Error('Parent comment does not belong to this timetable slot');
    }
  }

  return await commentModel.createComment({
    timetable_slot_id,
    author_id,
    parent_comment_id: parent_comment_id || null,
    message: message.trim(),
    status: 'OPEN'
  });
};

export const getCommentsForSlot = async (slotId) => {
  if (!slotId) {
    throw new Error('Timetable slot ID is required');
  }

  // Throws if not found
  await timetableModel.getSlotById(slotId);

  return await commentModel.getCommentsBySlot(slotId);
};

export const updateCommentStatus = async (id, status) => {
  if (!id || !status) {
    throw new Error('Comment ID and status are required');
  }

  const allowed = ['OPEN', 'RESOLVED', 'CANCELLED'];
  if (!allowed.includes(status.toUpperCase())) {
    throw new Error('Invalid status. Must be one of: OPEN, RESOLVED, CANCELLED');
  }

  const ok = await commentModel.updateCommentStatus(id, status.toUpperCase());
  if (!ok) {
    throw new Error('Comment not found');
  }

  return await commentModel.getCommentById(id);
};

export const deleteComment = async (id) => {
  if (!id) {
    throw new Error('Comment ID is required');
  }

  const ok = await commentModel.deleteComment(id);
  if (!ok) {
    throw new Error('Comment not found');
  }

  return true;
};


