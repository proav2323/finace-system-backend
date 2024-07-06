import express from "express";
import { db } from "../models/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const router = express.Router();

router.get("/:email", async (req, res) => {
  const email = req.params.email;
  if (!email) {
    return res.status(404).send("no email provided");
  }

  const user = await db.user.findUnique({
    where: { email: email },
    include: {
      transactions: { include: { account: true, category: true } },
      categories: true,
      accounts: true,
    },
  });

  if (!user) {
    return res.status(404).send("no user found with this email");
  }

  res.json(user).status(200);
});

router.get("/", async (req, res) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader) {
    return res.status(404).send("no token");
  }

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];

  if (!bearerToken) {
    return res.status(404).send("no token");
  }

  const data = jwt.verify(bearerToken, process.env.SECRET ?? "NEW SCRETE");

  if (!data) {
    return res.status(403).send("unauthorized");
  }

  const { email } = data;

  if (!email) {
    return res.status(500).send("somethign went wrong");
  }

  const user = await db.user.findUnique({ where: { email: email } });

  res.json(user).status(200);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).send("no all data provided");
  }

  const user = await db.user.findUnique({
    where: { email: email },
    include: {
      transactions: { include: { account: true, category: true } },
      categories: true,
      accounts: true,
    },
  });

  if (!user) {
    return res.status(404).send("no user found with this email");
  }

  const hash = user.password;

  const compare = await bcrypt.compare(hash, password);

  if (!compare) {
    return res.send("wrong credentials").status(401);
  }

  const token = jwt.sign(
    { email: user.email, id: user.id },
    process.env.SECRET ?? "NEW SCRETE"
  );
  res.json({ token: token }).status(200);
});

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(404).send("no all data provided");
  }

  const user = await db.user.findUnique({
    where: { email: email },
    include: {
      transactions: { include: { account: true, category: true } },
      categories: true,
      accounts: true,
    },
  });

  if (user) {
    return res.status(404).send("user found with this email... login");
  }

  const hashPassword = await bcrypt.hashSync(password, 12);

  const newUser = await db.user.create({
    data: {
      email: email,
      name: name,
      password: hashPassword,
    },
  });

  const token = jwt.sign(
    { email: newUser.email, id: newUser.id },
    process.env.SECRET ?? "NEW SCRETE"
  );
  res.json({ token: token }).status(200);
});
