import db from '../config/db.js';

/**
 * User Model - Data Access Layer for Users
 * Handles all database operations related to users
 */

export const createUser = async (userData) => {
  try {
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, role, created_at, updated_at) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [userData.name, userData.email, userData.password, userData.role]
    );
    return { id: result.insertId, ...userData };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, role, created_at, updated_at 
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, password, role, created_at, updated_at 
       FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async (filters = {}) => {
  try {
    let query = `SELECT id, name, email, role, created_at, updated_at FROM users WHERE 1=1`;
    const params = [];

    if (filters.role) {
      query += ` AND role = ?`;
      params.push(filters.role);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await db.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const fields = [];
    const values = [];

    if (userData.name !== undefined) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }
    if (userData.password !== undefined) {
      fields.push('password = ?');
      values.push(userData.password);
    }
    if (userData.role !== undefined) {
      fields.push('role = ?');
      values.push(userData.role);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push('updated_at = NOW()');
    values.push(id);

    const [result] = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return getUserById(id);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Email already exists');
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const [result] = await db.query(`DELETE FROM users WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};
