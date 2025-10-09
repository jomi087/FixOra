// export interface AppError extends Error {
//   status?: number;
//   message: string;
// }

// export class ApplicationError extends Error implements AppError {
//     status: number;

//     constructor(message: string, status: number) {
//         super(message);
//         this.status = status;
//         Object.setPrototypeOf(this, new.target.prototype);
//     }
// }

export class AppError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.status = status;
        this.name = "AppError";
    }
}