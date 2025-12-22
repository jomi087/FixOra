import { NextFunction, Request, Response } from "express";
import { IReverseGeocodeUseCase } from "../../application/interface/useCases/geocode/ola/IReverseGeocodeUseCase";
import { IForwardGeocodeUseCase } from "../../application/interface/useCases/geocode/ola/IForwardGeocodeUseCase";
import { IAutocompleteGeocodeUseCase } from "../../application/interface/useCases/geocode/ola/IAutocompleteGeocodeUseCase";

export class GeocodeController {
    constructor(
        private _reverseGeocodeUseCase: IReverseGeocodeUseCase,
        private _forwardGeocodeUseCase: IForwardGeocodeUseCase,
        private _autocompleteGeocodeUseCase: IAutocompleteGeocodeUseCase,

    ) { }

    async reverse(req: Request, res: Response, next: NextFunction) {
        try {
            const { lat, lng } = req.query;

            const address = await this._reverseGeocodeUseCase.execute(Number(lat), Number(lng));
            res.json({ address });
        } catch (error) {
            next(error);
        }
    }

    async forward(req: Request, res: Response, next: NextFunction) {
        try {
            const { address } = req.query;

            const results = await this._forwardGeocodeUseCase.execute(String(address));
            
            res.json(results);
        } catch (error) {
            next(error);
        }
    }

    async autocomplete(req: Request, res: Response, next: NextFunction) {
        try {
            const { address } = req.query;

            const results = await this._autocompleteGeocodeUseCase.execute(String(address));
            res.json(results);
        } catch (error) {
            next(error);
        }
    }
}
