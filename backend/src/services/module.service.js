import * as moduleModel from '../models/module.model.js';
import * as userModel from '../models/user.model.js';

/**
 * Module Service - Business Logic Layer for Modules
 */

export const createModule = async (moduleData) => {
  // Validate required fields
  if (!moduleData.module_code || !moduleData.module_name) {
    throw new Error('Missing required fields: module_code, module_name');
  }

  // Validate module code format (should be uppercase alphanumeric)
  const moduleCodeRegex = /^[A-Z0-9]+$/;
  if (!moduleCodeRegex.test(moduleData.module_code.toUpperCase())) {
    throw new Error('Module code must be uppercase alphanumeric');
  }

  moduleData.module_code = moduleData.module_code.toUpperCase();

  // Check if module code already exists
  const existingModule = await moduleModel.getModuleByCode(moduleData.module_code);
  if (existingModule) {
    throw new Error('Module with this code already exists');
  }

  // Validate module leader if provided
  if (moduleData.module_leader_id) {
    const leader = await userModel.getUserById(moduleData.module_leader_id);
    if (!leader) {
      throw new Error('Module leader not found');
    }
    if (leader.role !== 'FACULTY' && leader.role !== 'ADMIN') {
      throw new Error('Module leader must be a faculty member or admin');
    }
  }

  // Validate credits if provided
  if (moduleData.credits !== undefined && (moduleData.credits < 0 || moduleData.credits > 30)) {
    throw new Error('Credits must be between 0 and 30');
  }

  return await moduleModel.createModule(moduleData);
};

export const getModuleById = async (id) => {
  if (!id) {
    throw new Error('Module ID is required');
  }
  const module = await moduleModel.getModuleById(id);
  if (!module) {
    throw new Error('Module not found');
  }
  return module;
};

export const getModuleByCode = async (moduleCode) => {
  if (!moduleCode) {
    throw new Error('Module code is required');
  }
  return await moduleModel.getModuleByCode(moduleCode.toUpperCase());
};

export const getAllModules = async (filters = {}) => {
  return await moduleModel.getAllModules(filters);
};

export const updateModule = async (id, moduleData) => {
  if (!id) {
    throw new Error('Module ID is required');
  }

  // Check if module exists
  const existingModule = await moduleModel.getModuleById(id);
  if (!existingModule) {
    throw new Error('Module not found');
  }

  // Validate module code if provided
  if (moduleData.module_code) {
    const moduleCodeRegex = /^[A-Z0-9]+$/;
    if (!moduleCodeRegex.test(moduleData.module_code.toUpperCase())) {
      throw new Error('Module code must be uppercase alphanumeric');
    }
    moduleData.module_code = moduleData.module_code.toUpperCase();

    // Check if new module code conflicts with existing module
    const moduleWithCode = await moduleModel.getModuleByCode(moduleData.module_code);
    if (moduleWithCode && moduleWithCode.id !== parseInt(id)) {
      throw new Error('Module code already taken by another module');
    }
  }

  // Validate module leader if provided
  if (moduleData.module_leader_id) {
    const leader = await userModel.getUserById(moduleData.module_leader_id);
    if (!leader) {
      throw new Error('Module leader not found');
    }
    if (leader.role !== 'FACULTY' && leader.role !== 'ADMIN') {
      throw new Error('Module leader must be a faculty member or admin');
    }
  }

  // Validate credits if provided
  if (moduleData.credits !== undefined && (moduleData.credits < 0 || moduleData.credits > 30)) {
    throw new Error('Credits must be between 0 and 30');
  }

  const updatedModule = await moduleModel.updateModule(id, moduleData);
  if (!updatedModule) {
    throw new Error('Failed to update module');
  }
  return updatedModule;
};

export const deleteModule = async (id) => {
  if (!id) {
    throw new Error('Module ID is required');
  }

  const module = await moduleModel.getModuleById(id);
  if (!module) {
    throw new Error('Module not found');
  }

  // TODO: Check if module has associated timetable slots before deleting
  // This would require checking timetable_slots table

  return await moduleModel.deleteModule(id);
};
