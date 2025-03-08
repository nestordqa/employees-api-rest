import express, { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createEmployee, deleteEmployee, getEmployee, getEmployees, getPositions, updateEmployee } from '../controllers/employeeController';

const router: Router = express.Router();

// Rutas protegidas con JWT
router.get('/positions', authMiddleware, getPositions);
router.post('/', authMiddleware, createEmployee);
router.get('/', authMiddleware, getEmployees);
router.get('/:id', authMiddleware, getEmployee);
router.put('/:id', authMiddleware, updateEmployee);
router.delete('/:id', authMiddleware, deleteEmployee);

export default router;
