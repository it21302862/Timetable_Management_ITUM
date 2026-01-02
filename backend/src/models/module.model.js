import db from '../config/db.js';

/**
 * Module Model - Data Access Layer for Modules
 * Handles all database operations related to modules
 */

export const createModule = async (moduleData) => {
  try {
    const [result] = await db.query(
      `INSERT INTO modules (module_code, module_name, module_leader_id, credits, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [
        moduleData.module_code,
        moduleData.module_name,
        moduleData.module_leader_id,
        moduleData.credits || 0
      ]
    );
    return { id: result.insertId, ...moduleData };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Module code already exists');
    }
    throw error;
  }
};

export const getModuleById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, u.name AS module_leader_name, u.email AS module_leader_email
       FROM modules m
       LEFT JOIN users u ON m.module_leader_id = u.id
       WHERE m.id = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getModuleByCode = async (moduleCode) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, u.name AS module_leader_name
       FROM modules m
       LEFT JOIN users u ON m.module_leader_id = u.id
       WHERE m.module_code = ?`,
      [moduleCode]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getAllModules = async (filters = {}) => {
  try {
    let query = `
      SELECT m.*, u.name AS module_leader_name, u.email AS module_leader_email
      FROM modules m
      LEFT JOIN users u ON m.module_leader_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.module_leader_id) {
      query += ` AND m.module_leader_id = ?`;
      params.push(filters.module_leader_id);
    }

    query += ` ORDER BY m.module_code ASC`;

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const updateModule = async (id, moduleData) => {
  try {
    const fields = [];
    const values = [];

    if (moduleData.module_code !== undefined) {
      fields.push('module_code = ?');
      values.push(moduleData.module_code);
    }
    if (moduleData.module_name !== undefined) {
      fields.push('module_name = ?');
      values.push(moduleData.module_name);
    }
    if (moduleData.module_leader_id !== undefined) {
      fields.push('module_leader_id = ?');
      values.push(moduleData.module_leader_id);
    }
    if (moduleData.credits !== undefined) {
      fields.push('credits = ?');
      values.push(moduleData.credits);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const [result] = await db.query(
      `UPDATE modules SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return getModuleById(id);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Module code already exists');
    }
    throw error;
  }
};

export const deleteModule = async (id) => {
  try {
    const [result] = await db.query(`DELETE FROM modules WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
