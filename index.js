import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/auth.js";
import { AccountRouter } from "./routes/account.js";
import { TransactionsRouter } from "./routes/transactions.js";
import { CategoiresRouter } from "./routes/categories.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/auth", router);
app.use("/account", AccountRouter);
app.use("/transactions", TransactionsRouter);
app.use("/categories", CategoiresRouter);

app.get("/", (req, res) => {
  res.status(200).send("hellow world");
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});
