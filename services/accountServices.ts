import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAccount = async (req:Request, res:Response)  : Promise<any> => {
    const { userId } = req.body;
    
    const account = await prisma.account.create({
      data: { userId, balance: 0 },
    });
  
    res.json({ message: "Account created", account });
}

export const Deposit=async (req:Request, res:Response) : Promise<any> => {
    const accountId = parseInt(req.params.id);
    const { amount } = req.body;
  
    if (amount <= 0) return res.status(400).json({ error: "Amount must be positive" });
  
    const account = await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: { increment: amount },
        transactions: {
          create: { type: "deposit", amount },
        },
      },
    });
  
    res.json({ message: "Deposit successful", account });
}

export const Withdraw = async (req:Request, res:Response) : Promise<any> => {
    const accountId = parseInt(req.params.id);
    const { amount } = req.body;
  
    const account = await prisma.account.findUnique({ where: { id: accountId } });
  
    if (!account) return res.status(404).json({ error: "Account not found" });
  
    if (amount <= 0) return res.status(400).json({ error: "Amount must be positive" });
  
    if (account.balance < amount) return res.status(400).json({ error: "Insufficient funds" });
  
    const updatedAccount = await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: { decrement: amount },
        transactions: {
          create: { type: "withdraw", amount },
        },
      },
    });
  
    res.json({ message: "Withdrawal successful", updatedAccount });
}

export const History= async (req:Request, res:Response) : Promise<any> => {
    const accountId = parseInt(req.params.id);
  
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { transactions: true },
    });
  
    if (!account) return res.status(404).json({ error: "Account not found" });
  
    res.json({ balance: account.balance, transactions: account.transactions });
}


//updates
export const getAccountByUserId=async (req: Request<{ id: string }>, res: Response) : Promise<any> =>{
    const userId = parseInt(req.params.id);
    const accounts = await prisma.account.findMany({
      where: { userId },
      include: { transactions: true },
    });
  
    if (!accounts) return res.status(404).json({ error: "No accounts found" });
    res.json(accounts);
  }