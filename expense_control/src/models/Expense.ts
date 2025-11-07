import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
    description: string;
    amount: number;
    date: Date;
    createdAt: Date;
}

const ExpenseSchema: Schema = new Schema<IExpense>(
    {
        description: { type: String, required: true, trim: true },
        amount: {
            type: Number,
            required: true,
            min: [0, "Amount must be >= 0"],
        },
        date: { type: Date, required: true },
    },
    { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export const Expense = mongoose.model<IExpense>("Expense", ExpenseSchema);
