import { PrismaClient } from "@prisma/client";
import { RegisterSchema } from "../schema/user.schema";

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  query: {
    user: {
      create({ args, query }) {
        args.data = RegisterSchema.parse(args.data);
        return query(args);
      },
    },
  },
});
