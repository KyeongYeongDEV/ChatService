import dotenv from "dotenv";

dotenv.config();

export const saltRounds = process.env.BCRYPT_SALT_ROUNDS || 2;
