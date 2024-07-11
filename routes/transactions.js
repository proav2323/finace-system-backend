import express from "express";
import { checkToken } from "../utills.js";
import { db } from "../models/prisma.js";

export const TransactionsRouter = express.Router();

TransactionsRouter.post("/add", async (req, res) => {
  const valid = checkToken(req);
  const { accountId, categoryId, amount, payee, notes, date } = req.body;
  console.log(accountId, categoryId, amount, payee, notes, date);

  if (valid === false) {
    return res.status(401).send("login first");
  }

  if (!valid) {
    return res.status(404).send("no data");
  }

  const { email, id } = valid;

  if (
    !email ||
    !id ||
    !accountId ||
    !categoryId ||
    !amount ||
    !payee ||
    !date
  ) {
    return res.status(404).send("no email or id from token");
  }

  const tranaction = await db.transactions.create({
    data: {
      userId: id,
      amount: amount,
      date: date,
      payee: payee,
      accountId: accountId,
      categoryId: categoryId,
      notes: notes,
    },
  });

  return res.status(200).json(tranaction);
});

TransactionsRouter.put("/update/:id", async (req, res) => {
  const valid = checkToken(req);
  const { accountId, categoryId, amount, payee, notes, date } = req.body;
  const transactionId = req.params.id;

  if (valid === false) {
    return res.status(401).send("login first");
  }

  if (!valid) {
    return res.status(404).send("no data");
  }

  const { email, id } = valid;

  if (
    !email ||
    !id ||
    !accountId ||
    !categoryId ||
    !amount ||
    !payee ||
    !notes ||
    !date
  ) {
    return res.status(404).send("no email or id from token");
  }

  const transaction = await db.transactions.update({
    where: {
      id: transactionId,
      userId: id,
    },
    data: {
      amount: amount,
      date: date,
      payee: payee,
      accountId: accountId,
      categoryId: categoryId,
      notes: notes,
    },
  });

  return res.status(200).json(transaction);
});

TransactionsRouter.delete("/delete/:id", async (req, res) => {
  const valid = checkToken(req);
  const transactionsId = req.params.id;

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

  const transaction = await db.transactions.delete({
    where: {
      id: transactionsId,
      userId: id,
    },
  });

  return res.status(200).json({ message: "transactions deleted" });
});

TransactionsRouter.get("/", async (req, res) => {
  const valid = checkToken(req);
  const { start, end, account } = req.query;

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

  let query = {
    userId: id,
  };
  console.log(start, end, account);

  if (start && end) {
    query = {
      date: {
        gt: new Date(start),
        lt: new Date(end),
      },
      ...query,
    };
  }

  if (account) {
    if (account !== "allAccounts") {
      query = {
        accountId: account,
        ...query,
      };
    }
  }
  const transactions = await db.transactions.findMany({
    where: query,
    include: {
      account: true,
      category: true,
    },
  });

  return res.status(200).json(transactions);
});

TransactionsRouter.get("/get/:id", async (req, res) => {
  const valid = checkToken(req);
  const transctionId = req.params.id;
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

  const account = await db.transactions.findUnique({
    where: {
      userId: id,
      id: transctionId,
    },
    include: {
      account: true,
      category: true,
    },
  });

  return res.status(200).json(account);
});
