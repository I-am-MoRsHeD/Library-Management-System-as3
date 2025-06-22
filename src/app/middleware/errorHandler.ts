import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    let statusCode = 500;
    let message = 'Something went wrong';
    let errors = err;

    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation failed';
        errors = err.flatten();

    };
    res.status(statusCode).json({
        success: false,
        message,
        error: errors
    });
}