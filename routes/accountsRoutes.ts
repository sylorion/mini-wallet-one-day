import { Router } from "express";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const router = Router();

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user
 *     responses:
 *       200:
 *         description: Account created successfully
 */
router.post("/", async (req, res) => {
    const { userId } = req.body;
    
    const account = await prisma.account.create({
      data: { userId, balance: 0 },
    });
  
    res.json({ message: "Account created", account });
});

/**
 * @swagger
 * /api/accounts/{id}/deposit:
 *   post:
 *     summary: Deposit money to an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Invalid amount
 */
router.post("/:id/deposit", async (req, res) : Promise<any> => {
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
});

/**
 * @swagger
 * /api/accounts/{id}/withdraw:
 *   post:
 *     summary: Withdraw money from an account
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Invalid amount or insufficient funds
 *       404:
 *         description: Account not found
 */
router.post("/:id/withdraw", async (req, res) : Promise<any> => {
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
});

/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Get account details and transactions
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
 *       404:
 *         description: Account not found
 */
router.get("/:id", async (req, res) : Promise<any> => {
    const accountId = parseInt(req.params.id);
  
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: { transactions: true },
    });
  
    if (!account) return res.status(404).json({ error: "Account not found" });
  
    res.json({ balance: account.balance, transactions: account.transactions });
});

export default router;