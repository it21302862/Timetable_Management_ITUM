import db from '../config/db.js';

/**
 * Timetable Comment Model - Data Access Layer
 */

export const createComment = async (commentData) => {
  const {
    timetable_slot_id,
    author_id,
    parent_comment_id = null,
    message,
    status = 'OPEN'
  } = commentData;

  const [result] = await db.query(
    `INSERT INTO timetable_comments 
     (timetable_slot_id, author_id, parent_comment_id, message, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [timetable_slot_id, author_id, parent_comment_id, message, status]
  );

  return { id: result.insertId, ...commentData };
};

export const getCommentsBySlot = async (slotId) => {
  const [rows] = await db.query(
    `SELECT c.*, 
            u.name AS author_name,
            u.email AS author_email
     FROM timetable_comments c
     JOIN users u ON c.author_id = u.id
     WHERE c.timetable_slot_id = ?
     ORDER BY c.created_at ASC`,
    [slotId]
  );

  return rows;
};

export const getCommentById = async (id) => {
  const [rows] = await db.query(
    `SELECT c.*, 
            u.name AS author_name,
            u.email AS author_email
     FROM timetable_comments c
     JOIN users u ON c.author_id = u.id
     WHERE c.id = ?`,
    [id]
  );

  return rows[0] || null;
};

export const updateCommentStatus = async (id, status) => {
  const [result] = await db.query(
    `UPDATE timetable_comments 
     SET status = ?, updated_at = NOW()
     WHERE id = ?`,
    [status, id]
  );

  return result.affectedRows > 0;
};

export const deleteComment = async (id) => {
  const [result] = await db.query(
    `DELETE FROM timetable_comments WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};


