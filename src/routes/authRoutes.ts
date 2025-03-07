import express, { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea un nuevo usuario con email y contraseña.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       409:
 *         description: El usuario ya existe.
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión con un usuario existente
 *     description: Autentica al usuario y devuelve un token JWT.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas.
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra sesión del usuario actual
 *     description: Invalida el token del usuario actual.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso.
 */
router.post('/logout', authMiddleware, logout);

export default router;
