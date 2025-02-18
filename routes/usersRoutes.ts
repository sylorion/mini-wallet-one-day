import { Router} from "express";
import {
  createUser, login
} from '../services/userServices'


const router = Router()

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *          description: All fileds are required
 *       500:
 *          description: An error occured while creating a user
 */
router.post("/", createUser);


/**
 * @swagger
 * /api/users/auth/login:
 *   post:
 *     summary: User signin
 *     tags: [Users]
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
 *     description: Verifies credentials and generates a JWT token.
 *     responses:
 *       200:
 *         description: Logged successfull, token JWT generated.
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid Credentials
 * 
 */
router.post("/auth/login", login);



export default router;