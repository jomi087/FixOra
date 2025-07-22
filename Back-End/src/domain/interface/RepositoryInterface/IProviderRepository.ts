import { Provider } from "../../entities/ProviderEntity.js";

export interface IProviderRepository {
    create(data : Provider): Promise<void> 
}