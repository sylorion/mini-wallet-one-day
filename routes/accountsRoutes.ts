import { Router } from "express";
import {createAccount,Deposit
  ,Withdraw,History
} from '../services/accountServices'
import { protect } from "../middleware/authMiddleware";

const router = Router()

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 */
router.post("/", protect, createAccount);


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
router.post("/:id/deposit",Deposit );
 
/**
 * @swagger
 * /api/accounts/{id}/withdraw:
 *   post:
 *     summary: Withdraw money from an account
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
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
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Account not found
 */
router.post("/:id/withdraw", protect, Withdraw);


/**
 * @swagger
 * /api/accounts/{id}:
 *   get:
 *     summary: Get account details and transactions
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
 *       401:
 *         description: Unauthorized (Invalid or missing token)
 *       404:
 *         description: Account not found
 */
router.get("/:id", protect, History);

 



export default router;