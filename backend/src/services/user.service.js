import * as userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';

/**
 * User Service - Business Logic Layer for Users
 */

export const createUser = async (userData) => {
  // Validate required fields
  if (!userData.name || !userData.email || !userData.password || !userData.role) {
    throw new Error('Missing required fields: name, email, password, role');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userData.email)) {
    throw new Error('Invalid email format');
  }

  // Validate role
  const validRoles = ['ADMIN', 'FACULTY', 'STUDENT'];
  if (!validRoles.includes(userData.role.toUpperCase())) {
    throw new Error('Invalid role. Must be one of: ADMIN, FACULTY, STUDENT');
  }

  // Check if user already exists
  const existingUser = await userModel.getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Create user
  const user = await userModel.createUser({
    ...userData,
    password: hashedPassword,
    role: userData.role.toUpperCase()
  });

  // Remove password from response
  delete user.password;
  return user;
};

export const getUserById = async (id) => {
  if (!id) {
    throw new Error('User ID is required');
  }
  return await userModel.getUserById(id);
};

export const getUserByEmail = async (email) => {
  if (!email) {
    throw new Error('Email is required');
  }
  return await userModel.getUserByEmail(email);
};

export const getAllUsers = async (filters = {}) => {
  return await userModel.getAllUsers(filters);
};

export const updateUser = async (id, userData) => {
  if (!id) {
    throw new Error('User ID is required');
  }

  // Check if user exists
  const existingUser = await userModel.getUserById(id);
  if (!existingUser) {
    throw new Error('User not found');
  }

  // Validate email if provided
  if (userData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Check if email is already taken by another user
    const userWithEmail = await userModel.getUserByEmail(userData.email);
    if (userWithEmail && userWithEmail.id !== parseInt(id)) {
      throw new Error('Email already taken by another user');
    }
  }

  // Validate role if provided
  if (userData.role) {
    const validRoles = ['ADMIN', 'FACULTY', 'STUDENT'];
    if (!validRoles.includes(userData.role.toUpperCase())) {
      throw new Error('Invalid role. Must be one of: ADMIN, FACULTY, STUDENT');
    }
    userData.role = userData.role.toUpperCase();
  }

  // Hash password if provided
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }

  const updatedUser = await userModel.updateUser(id, userData);
  if (!updatedUser) {
    throw new Error('Failed to update user');
  }

  delete updatedUser.password;
  return updatedUser;
};

export const deleteUser = async (id) => {
  if (!id) {
    throw new Error('User ID is required');
  }

  const user = await userModel.getUserById(id);
  if (!user) {
    throw new Error('User not found');
  }

  return await userModel.deleteUser(id);
};

export const authenticateUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await userModel.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Remove password from response
  delete user.password;
  return user;
};
