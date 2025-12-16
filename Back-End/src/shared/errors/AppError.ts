// export class AppError extends Error {
//     constructor(
//         public readonly status: number,
//         message: string
//     ) {
//         super(message);
//         Object.setPrototypeOf(this, new.target.prototype);
//     }
// }


export class AppError extends Error {
    constructor(
        public readonly status: number,
        public readonly publicMessage: string,
        public readonly internalMessage?: string
    ){
        super(internalMessage ?? publicMessage);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

