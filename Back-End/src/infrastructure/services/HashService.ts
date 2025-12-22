import { IHashService } from "../../domain/interface/serviceInterfaceTempName/IHashService";
import bcrypt from "bcrypt";

export class HashService implements IHashService{
    async hash(password: string): Promise<string>{
        return await bcrypt.hash(password,10);
    }

    async compare(plainPass: string, hashedPass: string): Promise<boolean>{
        return await bcrypt.compare(plainPass, hashedPass);
    }

}
