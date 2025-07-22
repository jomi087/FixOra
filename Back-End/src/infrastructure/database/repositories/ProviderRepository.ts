import { Provider } from "../../../domain/entities/ProviderEntity.js";
import { IProviderRepository } from "../../../domain/interface/RepositoryInterface/IProviderRepository.js";
import ProviderModel from "../models/ProviderModel.js";

export class ProviderRepository implements IProviderRepository{
    async create(data: Provider): Promise<void> {
        await new ProviderModel(data).save()
    }
}