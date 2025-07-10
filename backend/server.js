import express from "express";
import cors from "cors";
import todoRouter from "./routes/todo.js";
import verifyToken from "./middleware/auth.js";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.use("/todos", verifyToken, todoRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
});