export interface CustomError extends Error {
    message: string;
    statusCode: number;
    errors : { path?: string; message: string }[]
}