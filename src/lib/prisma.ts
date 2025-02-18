import { PrismaClient } from "@prisma/client";

//Will give issues in development
const prisma = new PrismaClient();

export default prisma;
