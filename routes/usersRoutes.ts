import { Router} from "express";
import {
  createUser
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




export default router;