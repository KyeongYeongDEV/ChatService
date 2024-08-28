import dotenv from "dotenv";

dotenv.config();

export const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "2", 10);
