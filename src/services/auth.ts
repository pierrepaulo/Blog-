import { User } from "@prisma/client";
import { createJWT, readJWT } from "../libs/jwt";
import { Request } from "express";
import { TokenPayload } from "../types/token-payload";
import { getUserById } from "./user";

export const createToken = (user: User) => {
  return createJWT({ id: user.id });
};

export const verifyRequeste = async (req: Request) => {
  const { authorization } = req.headers;
  if (authorization) {
    const authSplit = authorization.split("Bearer ");
    if (authSplit[1]) {
      const payload = readJWT(authSplit[1]);
      if (payload) {
        const userId = (payload as TokenPayload).id;
        const user = await getUserById(userId);
        if (user) return user;
      }
    }
  }
  return false;
};
