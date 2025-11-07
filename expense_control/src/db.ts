import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/expensesDB";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Conectado ao MongoDB");
    } catch (err) {
        console.error("Erro ao conectar no MongoDB:", err);
        process.exit(1);
    }
};
