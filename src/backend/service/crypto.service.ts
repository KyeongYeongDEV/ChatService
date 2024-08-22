import bcrypt from "bcrypt";
import { Service } from "typedi";
import { saltRounds } from "../configs/crypto.confing";

@Service()
export class CryptoService {
    async hashPassword(plainPassword : string) : Promise<string> {
        return  await bcrypt.hash(plainPassword, saltRounds);
    }

    async comparePassword(plainPassword : string, hashPassword : string) : Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashPassword);
    }
}