import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/auth.js";
import severless from "serverless-http";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use("/auth", router);

app.get("/", (req, res) => {
  res.status(200).send("hellow world");
});

module.exports.handler = severless(app);
