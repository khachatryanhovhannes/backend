import { hash as bcryptHash } from "bcrypt";
import { hash as argon2Hash, verify } from "argon2";

export const generatePasswordHash = async (
  password: string
): Promise<string> => {
  const bcryptHashed = await bcryptHash(password, 10);
  const hashedPassword = await argon2Hash(bcryptHashed);
  return hashedPassword;
};

export const comparePasswordHash = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await verify(hashedPassword, await bcryptHash(password, 10));
};
