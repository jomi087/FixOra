import { IHashService } from "../../domain/interface/ServiceInterface/IHashService.js";
import bcrypt from 'bcrypt'

export class HashService implements IHashService{
    async hash(password: string): Promise<string>{
        return await bcrypt.hash(password,10)
    }

    async compare(plainPass: string, hashedPass: string): Promise<boolean>{
        return await bcrypt.compare(plainPass, hashedPass);
    }

}
