import express from "express";
import { checkToken } from "../utills.js";
import { db } from "../models/prisma.js";

export const CategoiresRouter = express.Router();

CategoiresRouter.post("/add", async (req, res) => {
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

  const categroy = await db.categories.create({
    data: {
      name: name,
      userId: id,
    },
  });

  return res.status(200).json(categroy);
});

CategoiresRouter.put("/update/:id", async (req, res) => {
  const valid = checkToken(req);
  const { name } = req.body;
  const categoryId = req.params.id;

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

  const categrouies = await db.categories.update({
    where: {
      id: categoryId,
      userId: id,
    },
    data: {
      name: name,
    },
  });

  return res.status(200).json(categrouies);
});

CategoiresRouter.delete("/delete/:id", async (req, res) => {
  const valid = checkToken(req);
  const categoryId = req.params.id;

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

  const categories = await db.categories.delete({
    where: {
      id: categoryId,
      userId: id,
    },
  });

  return res.status(200).json({ message: "category deleted" });
});

CategoiresRouter.get("/", async (req, res) => {
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

  const category = await db.categories.findMany({
    where: {
      userId: id,
    },
  });

  return res.status(200).json(category);
});

CategoiresRouter.get("/get/:id", async (req, res) => {
  const valid = checkToken(req);
  const categoryId = req.params.id;
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

  const category = await db.categories.findUnique({
    where: {
      userId: id,
      id: categoryId,
    },
  });

  return res.status(200).json(category);
});
