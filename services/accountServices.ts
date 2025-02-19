import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId } = req.body;

  if (!userId || isNaN(userId))
    return res.status(400).json({ error: "Invalid user ID" });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const account = await prisma.account.create({
    data: { userId, balance: 0 },
  });
  res.json({ message: "Account created", account });
};

export const Deposit = async (req: Request, res: Response): Promise<any> => {
  const accountId = parseInt(req.params.id, 10);

  const { amount } = req.body;

  if (isNaN(accountId) || amount <= 0)
    return res.status(400).json({ error: "Invalid input" });

  try {
    const account = await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: { increment: amount },
        transactions: { create: { type: "deposit", amount } },
      },
    });

    res.json({ message: "Deposit successful", account });
  } catch (error) {
    res.status(404).json({ error: "Account not found" });
  }
};

export const Withdraw = async (req: Request, res: Response): Promise<any> => {
  const accountId = parseInt(req.params.id, 10);

  const { amount } = req.body;

  if (isNaN(accountId) || amount <= 0)
    return res.status(400).json({ error: "Invalid input" });

  const account = await prisma.account.findUnique({ where: { id: accountId } });

  if (!account || account.balance < amount)
    return res
      .status(400)
      .json({ error: "Insufficient funds or account not found" });

  const updatedAccount = await prisma.account.update({
    where: { id: accountId },
    data: {
      balance: { decrement: amount },
      transactions: { create: { type: "withdraw", amount } },
    },
  });

  res.json({ message: "Withdrawal successful", updatedAccount });
};

export const History = async (req: Request, res: Response): Promise<any> => {
  const accountId = parseInt(req.params.id, 10);

  if (isNaN(accountId))
    return res.status(400).json({ error: "Invalid account ID" });

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: { transactions: true },
  });

  if (!account) return res.status(404).json({ error: "Account not found" });

  res.json({ balance: account.balance, transactions: account.transactions });
};

//updates

export const getAccountByUserId = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) return res.status(400).json({ error: "Invalid user ID" });

  const accounts = await prisma.account.findMany({
    where: { userId },
    include: { transactions: true },
  });

  if (!accounts.length)
    return res.status(404).json({ error: "No accounts found" });

  res.json(accounts);
};
