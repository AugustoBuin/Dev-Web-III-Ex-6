import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import expenseRoutes from "./routes/expenseRoutes";
import { connectDB } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar ao MongoDB
connectDB();

// Servir frontend estático
app.use(express.static(path.join(__dirname, "..", "public")));

// Rotas da API prefixed com /api/expenses
app.use("/api/expenses", expenseRoutes);

// Rota root (serve index)
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
