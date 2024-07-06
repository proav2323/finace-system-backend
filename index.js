import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/auth.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/auth", router);

app.get("/", (req, res) => {
  res.status(200).send("hellow world");
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});
