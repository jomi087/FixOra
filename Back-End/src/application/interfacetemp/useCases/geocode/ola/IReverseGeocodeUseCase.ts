
export interface IReverseGeocodeUseCase {
    execute(lat: number, lng: number): Promise<string>
}
