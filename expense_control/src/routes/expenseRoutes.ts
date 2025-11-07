import { Router } from "express";
import {
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getTotalExpenses,
} from "../controllers/expenseController";

const router = Router();

router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.get("/total", getTotalExpenses);

export default router;
