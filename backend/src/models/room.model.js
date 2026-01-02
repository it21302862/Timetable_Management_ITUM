import db from '../config/db.js';

/**
 * Room Model - Data Access Layer for Rooms
 * Handles all database operations related to rooms
 */

export const createRoom = async (roomData) => {
  try {
    const [result] = await db.query(
      `INSERT INTO rooms (room_name, room_type, capacity, building, floor, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        roomData.room_name,
        roomData.room_type,
        roomData.capacity || null,
        roomData.building || null,
        roomData.floor || null
      ]
    );
    return { id: result.insertId, ...roomData };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Room name already exists');
    }
    throw error;
  }
};

export const getRoomById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM rooms WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getRoomByName = async (roomName) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM rooms WHERE room_name = ?`,
      [roomName]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getAllRooms = async (filters = {}) => {
  try {
    let query = `SELECT * FROM rooms WHERE 1=1`;
    const params = [];

    if (filters.room_type) {
      query += ` AND room_type = ?`;
      params.push(filters.room_type);
    }

    if (filters.building) {
      query += ` AND building = ?`;
      params.push(filters.building);
    }

    if (filters.min_capacity) {
      query += ` AND capacity >= ?`;
      params.push(filters.min_capacity);
    }

    query += ` ORDER BY building, room_name ASC`;

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const getAvailableRooms = async (day, startTime, endTime) => {
  try {
    const [rows] = await db.query(
      `SELECT r.* 
       FROM rooms r
       WHERE r.id NOT IN (
         SELECT DISTINCT room_id 
         FROM timetable_slots 
         WHERE day = ? 
           AND ((start_time < ? AND end_time > ?) 
                OR (start_time < ? AND end_time > ?))
       )
       ORDER BY r.building, r.room_name ASC`,
      [day, endTime, startTime, endTime, startTime]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const fields = [];
    const values = [];

    if (roomData.room_name !== undefined) {
      fields.push('room_name = ?');
      values.push(roomData.room_name);
    }
    if (roomData.room_type !== undefined) {
      fields.push('room_type = ?');
      values.push(roomData.room_type);
    }
    if (roomData.capacity !== undefined) {
      fields.push('capacity = ?');
      values.push(roomData.capacity);
    }
    if (roomData.building !== undefined) {
      fields.push('building = ?');
      values.push(roomData.building);
    }
    if (roomData.floor !== undefined) {
      fields.push('floor = ?');
      values.push(roomData.floor);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const [result] = await db.query(
      `UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return getRoomById(id);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Room name already exists');
    }
    throw error;
  }
};

export const deleteRoom = async (id) => {
  try {
    const [result] = await db.query(`DELETE FROM rooms WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
