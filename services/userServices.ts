import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {validationResult } from "express-validator";

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });
    res.json({
      message: "User created",
      user: { id: user.id, username, email },
    });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id, email:user.email }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Logged successfully", token });
};

//updates

export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, username: user.username, email: user.email });
};
