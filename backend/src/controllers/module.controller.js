import * as moduleService from '../services/module.service.js';

/**
 * Module Controller - HTTP Request/Response Handling
 */

export const createModule = async (req, res, next) => {
  try {
    const module = await moduleService.createModule(req.body);
    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: module
    });
  } catch (error) {
    next(error);
  }
};

export const getModuleById = async (req, res, next) => {
  try {
    const module = await moduleService.getModuleById(req.params.id);
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    next(error);
  }
};

export const getModuleByCode = async (req, res, next) => {
  try {
    const module = await moduleService.getModuleByCode(req.params.code);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }
    res.status(200).json({
      success: true,
      data: module
    });
  } catch (error) {
    next(error);
  }
};

export const getAllModules = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.module_leader_id) {
      filters.module_leader_id = req.query.module_leader_id;
    }
    const modules = await moduleService.getAllModules(filters);
    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules
    });
  } catch (error) {
    next(error);
  }
};

export const updateModule = async (req, res, next) => {
  try {
    const module = await moduleService.updateModule(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: module
    });
  } catch (error) {
    next(error);
  }
};

export const deleteModule = async (req, res, next) => {
  try {
    await moduleService.deleteModule(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
