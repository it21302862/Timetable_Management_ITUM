import db from '../config/db.js';

/**
 * Timetable Model - Data Access Layer for Timetable Slots
 * Handles all database operations related to timetable
 */

export const createSlot = async (slotData) => {
  try {
    const [result] = await db.query(
      `INSERT INTO timetable_slots 
       (module_id, instructor_id, room_id, day, start_time, end_time, session_type, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        slotData.module_id,
        slotData.instructor_id,
        slotData.room_id,
        slotData.day,
        slotData.start_time,
        slotData.end_time,
        slotData.session_type || 'LECTURE'
      ]
    );
    return { id: result.insertId, ...slotData };
  } catch (error) {
    throw error;
  }
};

export const getSlotById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, 
              m.module_code, m.module_name,
              u.name AS instructor_name, u.email AS instructor_email,
              r.room_name, r.room_type, r.building
       FROM timetable_slots t
       JOIN modules m ON t.module_id = m.id
       JOIN users u ON t.instructor_id = u.id
       JOIN rooms r ON t.room_id = r.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const findConflicts = async (day, roomId, startTime, endTime, excludeSlotId = null) => {
  try {
    let query = `
      SELECT t.*, m.module_code, u.name AS instructor_name, r.room_name
      FROM timetable_slots t
      JOIN modules m ON t.module_id = m.id
      JOIN users u ON t.instructor_id = u.id
      JOIN rooms r ON t.room_id = r.id
      WHERE t.day = ?
        AND t.room_id = ?
        AND ((t.start_time < ? AND t.end_time > ?) 
             OR (t.start_time < ? AND t.end_time > ?))
    `;
    const params = [day, roomId, endTime, startTime, endTime, startTime];

    if (excludeSlotId) {
      query += ` AND t.id != ?`;
      params.push(excludeSlotId);
    }

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const findInstructorConflicts = async (instructorId, day, startTime, endTime, excludeSlotId = null) => {
  try {
    let query = `
      SELECT t.*, m.module_code, r.room_name
      FROM timetable_slots t
      JOIN modules m ON t.module_id = m.id
      JOIN rooms r ON t.room_id = r.id
      WHERE t.instructor_id = ?
        AND t.day = ?
        AND ((t.start_time < ? AND t.end_time > ?) 
             OR (t.start_time < ? AND t.end_time > ?))
    `;
    const params = [instructorId, day, endTime, startTime, endTime, startTime];

    if (excludeSlotId) {
      query += ` AND t.id != ?`;
      params.push(excludeSlotId);
    }

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getWeeklyTimetable = async (filters = {}) => {
  try {
    let query = `
      SELECT t.*, 
             m.module_code, m.module_name,
             u.name AS instructor_name, u.email AS instructor_email,
             r.room_name, r.room_type, r.building, r.capacity
      FROM timetable_slots t
      JOIN modules m ON t.module_id = m.id
      JOIN users u ON t.instructor_id = u.id
      JOIN rooms r ON t.room_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.day) {
      query += ` AND t.day = ?`;
      params.push(filters.day);
    }

    if (filters.instructor_id) {
      query += ` AND t.instructor_id = ?`;
      params.push(filters.instructor_id);
    }

    if (filters.module_id) {
      query += ` AND t.module_id = ?`;
      params.push(filters.module_id);
    }

    if (filters.room_id) {
      query += ` AND t.room_id = ?`;
      params.push(filters.room_id);
    }

    query += ` ORDER BY FIELD(t.day, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'), 
               t.start_time ASC`;

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getTimetableByInstructor = async (instructorId) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, 
              m.module_code, m.module_name,
              r.room_name, r.room_type, r.building
       FROM timetable_slots t
       JOIN modules m ON t.module_id = m.id
       JOIN rooms r ON t.room_id = r.id
       WHERE t.instructor_id = ?
       ORDER BY FIELD(t.day, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'), 
                t.start_time ASC`,
      [instructorId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getTimetableByModule = async (moduleId) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, 
              u.name AS instructor_name, u.email AS instructor_email,
              r.room_name, r.room_type, r.building
       FROM timetable_slots t
       JOIN users u ON t.instructor_id = u.id
       JOIN rooms r ON t.room_id = r.id
       WHERE t.module_id = ?
       ORDER BY FIELD(t.day, 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'), 
                t.start_time ASC`,
      [moduleId]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const updateSlot = async (id, slotData) => {
  try {
    const fields = [];
    const values = [];

    if (slotData.module_id !== undefined) {
      fields.push('module_id = ?');
      values.push(slotData.module_id);
    }
    if (slotData.instructor_id !== undefined) {
      fields.push('instructor_id = ?');
      values.push(slotData.instructor_id);
    }
    if (slotData.room_id !== undefined) {
      fields.push('room_id = ?');
      values.push(slotData.room_id);
    }
    if (slotData.day !== undefined) {
      fields.push('day = ?');
      values.push(slotData.day);
    }
    if (slotData.start_time !== undefined) {
      fields.push('start_time = ?');
      values.push(slotData.start_time);
    }
    if (slotData.end_time !== undefined) {
      fields.push('end_time = ?');
      values.push(slotData.end_time);
    }
    if (slotData.session_type !== undefined) {
      fields.push('session_type = ?');
      values.push(slotData.session_type);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const [result] = await db.query(
      `UPDATE timetable_slots SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return getSlotById(id);
  } catch (error) {
    throw error;
  }
};

export const deleteSlot = async (id) => {
  try {
    const [result] = await db.query(`DELETE FROM timetable_slots WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
