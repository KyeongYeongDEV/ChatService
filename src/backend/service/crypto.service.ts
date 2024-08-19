import bcrypt from "bcrypt";
import { saltRounds } from "../configs/crypto.confing";

export class CryptoService {
    async hashPassword(plainPassword : string) : Promise<string> {
        return  await bcrypt.hash(plainPassword, saltRounds);
    }

    async comparePassword(plainPassword : string, hashPassword : string) : Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashPassword);
    }
}