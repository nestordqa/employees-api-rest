import express, { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createEmployee, deleteEmployee, getEmployee, getEmployees, getPositions, updateEmployee } from '../controllers/employeeController';

const router: Router = express.Router();

/**
 * @swagger
 * /api/employees/positions:
 *   get:
 *     summary: Obtener todas las posiciones disponibles
 *     description: Devuelve la lista completa de posiciones laborales disponibles (protegido por JWT)
 *     tags: [Empleados]
 *     responses:
 *       200:
 *         description: Lista de posiciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Error al obtener las posiciones
 */
router.get('/positions', authMiddleware, getPositions);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Crear un nuevo empleado
 *     description: Crea un nuevo registro de empleado en el sistema (protegido por JWT)
 *     tags: [Empleados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - job_position
 *               - birthdate
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               job_position:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Empleado creado exitosamente
 *       409:
 *         description: El empleado ya existe
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error en el servidor
 */
router.post('/', authMiddleware, createEmployee);

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Obtener todos los empleados
 *     description: Devuelve la lista completa de empleados registrados (protegido por JWT)
 *     tags: [Empleados]
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Error al obtener los empleados
 */
router.get('/', authMiddleware, getEmployees);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Obtener un empleado por ID
 *     description: Devuelve los detalles de un empleado específico (protegido por JWT)
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Detalles del empleado obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.get('/:id', authMiddleware, getEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Actualizar un empleado
 *     description: Actualiza los datos de un empleado existente (protegido por JWT)
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Empleado actualizado exitosamente
 *       404:
 *         description: Empleado no encontrado
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error en el servidor
 */
router.put('/:id', authMiddleware, updateEmployee);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Eliminar un empleado
 *     description: Elimina un empleado del sistema (protegido por JWT)
 *     tags: [Empleados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *     responses:
 *       200:
 *         description: Empleado eliminado exitosamente
 *       404:
 *         description: Empleado no encontrado
 *       500:
 *         description: Error en el servidor
 */
router.delete('/:id', authMiddleware, deleteEmployee);

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - job_position
 *         - birthdate
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del empleado
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         job_position:
 *           type: string
 *         birthdate:
 *           type: string
 *           format: date-time
 *       example:
 *         firstName: "Bruce"
 *         lastName: "Wayne"
 *         job_position: "Desarrollador Fullstack"
 *         birthdate: "1990-01-01T00:00:00.000Z"
 */

export default router;
