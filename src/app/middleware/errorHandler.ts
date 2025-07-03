import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { CustomError } from '../interfaces/errorHandler';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorMessages: { path?: string; message: string }[] = [];

    // Zod validation error
    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Validation Error';
        errorMessages = err.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
        }));
    }

    // Mongoose validation error
    else if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        message = 'Mongoose Validation Error';
        errorMessages = Object.values(err.errors).map(e => ({
            path: e.path,
            message: e.message
        }));
    }

    // Mongoose cast error
    else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = 'Invalid ID';
        errorMessages = [{
            path: err.path,
            message: `Invalid ${err.path}: ${err.value}`
        }];
    }

    else if (typeof err === 'object' && err !== null && 'statusCode' in err && 'message' in err) {
        statusCode = (err as CustomError).statusCode;
        message = (err as CustomError).message;
        errorMessages = (err as CustomError).errors || [{ message }];
    }

    else if (err instanceof Error) {
        message = err.message;
        errorMessages = [{ message }];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
    });
};
