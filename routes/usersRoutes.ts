import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";




const router = Router()
const prisma = new PrismaClient()

//create user
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
 */
router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
  
    res.json({ message: "User created", user });
});




export default router;