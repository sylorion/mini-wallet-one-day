import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import {body } from "express-validator";

dotenv.config();

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"

export const protect = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

            if (!decoded.email) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const user = await prisma.user.findUnique({
                where: { email: decoded.email },
                select: { username: true, email: true }
            });

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const validateUserInput = [
  body("username").isString().notEmpty(),
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 }).withMessage("Password must be a string and have at least 6 charaters"),
];

export const validateLoginInput = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

