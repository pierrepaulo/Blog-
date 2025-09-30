import bcrypt from "bcryptjs";
import { prisma } from "../libs/prisma";

type CreateUserProps = {
  name: string;
  email: string;
  password: string;
};

export const createUser = async ({
  name,
  email,
  password,
}: CreateUserProps) => {
  email = email.toLowerCase();

  const user = await prisma.user.findFirst({
    where: { email },
  });
  if (user) return false;

  const newPassword = bcrypt.hashSync(password);

  return await prisma.user.create({
    data: { name, email, password: newPassword },
  });
};
