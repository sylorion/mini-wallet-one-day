import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

interface UserUpdateBody {
    username?: string;
    email?: string;
    password?: string;
  }
  

const prisma = new PrismaClient()
export const createUser=async (req:Request, res:Response)  : Promise<any> => {
    const { username, email, password } = req.body;

    if(!username || !email || !password){
        return res.status(400).json({ error: 'All fileds are required' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword },
        });

        const {password: _,...userWithoutPassword}=user
        res.json({ message: "User created", userWithoutPassword });
    } catch (error) {
        console.error('An error occured while creating a user', error);
        res.status(500).json({ error:'An error occured while creating a user' });
    }
  
    
}

//updates
export const getAllUsers = async (req: Request, res: Response)  : Promise<any> => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    res.json(users);
}

export const getUserById = async (req: Request<{ id: string }>, res: Response) : Promise<any> => {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
}

export const updateUser = async (req: Request<{ id: string }, {}, UserUpdateBody>, res: Response) => {
    const userId = parseInt(req.params.id);
    const { username, email, password } = req.body;
  
    let updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
  
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
      res.json({ message: "User updated", user: updatedUser });
    } catch (error) {
      res.status(404).json({ error: "User not found" });
    }
  }

