import { NextFunction, Request, Response } from "express";
import { verifyRequeste } from "../services/auth";
import { ExtendedRequest } from "../types/extended-request";

export const privateRoute = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await verifyRequeste(req);
  if (!user) {
    res.status(401).json({ error: "Acesso negado" });
    return;
  }

  req.user = user;

  next();
};
