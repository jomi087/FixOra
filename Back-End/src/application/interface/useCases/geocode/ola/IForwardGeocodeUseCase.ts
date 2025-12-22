import { ForwardGeocodeResult } from "../../../../../domain/entities/GeocodeResult";

export interface IForwardGeocodeUseCase {
    execute(address: string): Promise<ForwardGeocodeResult[]>
}
