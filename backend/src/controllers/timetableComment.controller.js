import * as commentService from '../services/timetableComment.service.js';

/**
 * Timetable Comment Controller
 */

export const addComment = async (req, res, next) => {
  try {
    const comment = await commentService.addComment(req.body);
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsForSlot = async (req, res, next) => {
  try {
    const comments = await commentService.getCommentsForSlot(req.params.slotId);
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

export const updateCommentStatus = async (req, res, next) => {
  try {
    const updated = await commentService.updateCommentStatus(
      req.params.id,
      req.body.status
    );
    res.status(200).json({
      success: true,
      message: 'Comment status updated',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await commentService.deleteComment(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


