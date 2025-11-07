import { Request, Response } from "express";
import { Expense } from "../models/Expense";

/**
 * Helper: parse date string (if frontend sends dd/mm/yyyy) or ISO.
 */
function parseDateMaybe(d?: string): Date {
    if (!d) return new Date();
    // If format dd/mm/yyyy
    const parts = d.split("/");
    if (parts.length === 3) {
        const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
        return new Date(yyyy, mm - 1, dd);
    }
    // Otherwise try Date constructor
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return new Date();
    return parsed;
}

export const createExpense = async (req: Request, res: Response) => {
    try {
        const { description, amount, date } = req.body;

        if (!description || description.trim() === "") {
            return res.status(400).json({ error: "Descrição é obrigatória." });
        }
        const value = Number(amount);
        if (isNaN(value) || value < 0) {
            return res.status(400).json({ error: "Valor inválido. Deve ser número >= 0." });
        }

        const expense = new Expense({
            description: description.trim(),
            amount: value,
            date: parseDateMaybe(date),
        });

        const saved = await expense.save();
        return res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao criar despesa." });
    }
};

export const getExpenses = async (_req: Request, res: Response) => {
    try {
        const expenses = await Expense.find().sort({ date: -1, createdAt: -1 }).lean();
        return res.json(expenses);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao listar despesas." });
    }
};

export const updateExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { description, amount, date } = req.body;

        if (!description || description.trim() === "") {
            return res.status(400).json({ error: "Descrição é obrigatória." });
        }
        const value = Number(amount);
        if (isNaN(value) || value < 0) {
            return res.status(400).json({ error: "Valor inválido. Deve ser número >= 0." });
        }

        const updated = await Expense.findByIdAndUpdate(
            id,
            {
                description: description.trim(),
                amount: value,
                date: parseDateMaybe(date),
            },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ error: "Despesa não encontrada." });

        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao atualizar despesa." });
    }
};

export const deleteExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const removed = await Expense.findByIdAndDelete(id);
        if (!removed) return res.status(404).json({ error: "Despesa não encontrada." });
        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao deletar despesa." });
    }
};

export const getTotalExpenses = async (_req: Request, res: Response) => {
    try {
        const result = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const total = (result[0] && result[0].total) ? result[0].total : 0;
        return res.json({ total });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao calcular total." });
    }
};
