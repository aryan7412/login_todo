import { Request, Response } from "express";
import {prisma} from "../prisma";

export const createTodo = async (req: Request, res: Response) => {
  const todo = await prisma.todo.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      userId: req.userId!,
    },
  });

  res.status(201).json(todo);
};

export const getTodos = async (req: Request, res: Response) => {
  const todos = await prisma.todo.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(todos);
};

export const updateTodo = async (req: Request, res: Response) => {
  const todo = await prisma.todo.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json(todo);
};

export const deleteTodo = async (req: Request, res: Response) => {
  await prisma.todo.delete({ where: { id: req.params.id } });
  res.json({ message: "Todo deleted" });
};
