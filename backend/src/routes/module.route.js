import express from 'express';
import {
  createModule,
  getModuleById,
  getModuleByCode,
  getAllModules,
  updateModule,
  deleteModule
} from '../controllers/module.controller.js';

const router = express.Router();

// Module CRUD routes
router.post('/', createModule);
router.get('/', getAllModules);
router.get('/code/:code', getModuleByCode);
router.get('/:id', getModuleById);
router.put('/:id', updateModule);
router.delete('/:id', deleteModule);

export default router;
