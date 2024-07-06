import express from "express";
import { checkToken } from "../utills.js";
import { db } from "../models/prisma.js";

export const AccountRouter = express.Router();

AccountRouter.post("/add", async (req, res) => {
  const valid = checkToken(req);
  const { name } = req.body;

  if (valid === false) {
    return res.status(401).send("login first");
  }

  if (!valid) {
    return res.status(404).send("no data");
  }

  const { email, id } = valid;

  if (!email || !id || !name) {
    return res.status(404).send("no email or id from token");
  }

  const account = await db.account.create({
    data: {
      name: name,
      userId: id,
    },
  });

  return res.status(200).json(account);
});

AccountRouter.put("/update/:id", async (req, res) => {
  const valid = checkToken(req);
  const { name } = req.body;
  const accountId = req.params.id;

  if (valid === false) {
    return res.status(401).send("login first");
  }

  if (!valid) {
    return res.status(404).send("no data");
  }

  const { email, id } = valid;

  if (!email || !id || !name) {
    return res.status(404).send("no email or id from token");
  }

  const account = await db.account.update({
    where: {
      id: accountId,
      userId: id,
    },
    data: {
      name: name,
    },
  });

  return res.status(200).json(account);
});

AccountRouter.delete("/delete/:id", async (req, res) => {
  const valid = checkToken(req);
  const accountId = req.params.id;

  if (valid === false) {
    return res.status(401).send("login first");
  }

  if (!valid) {
    return res.status(404).send("no data");
  }

  const { email, id } = valid;

  if (!email || !id) {
    return res.status(404).send("no email or id from token");
  }

  const account = await db.account.delete({
    where: {
      id: accountId,
      userId: id,
    },
  });

  return res.status(200).json({ message: "account deleted" });
});

AccountRouter.get("/", async (req, res) => {
  const valid = checkToken(req);

  if (valid === false) {
    return res.status(401).send("login first");
  }

  if (!valid) {
    return res.status(404).send("no data");
  }

  const { email, id } = valid;

  if (!email || !id) {
    return res.status(404).send("no email or id from token");
  }

  const account = await db.account.findMany({
    where: {
      userId: id,
    },
  });

  return res.status(200).json(account);
});

AccountRouter.get("/get/:id", async (req, res) => {
  const valid = checkToken(req);
  const accountId = req.params.id;
  if (valid === false) {
    return res.status(401).send("login first");
  }

  if (!valid) {
    return res.status(404).send("no data");
  }

  const { email, id } = valid;

  if (!email || !id) {
    return res.status(404).send("no email or id from token");
  }

  const account = await db.account.findUnique({
    where: {
      userId: id,
      id: accountId,
    },
  });

  return res.status(200).json(account);
});
