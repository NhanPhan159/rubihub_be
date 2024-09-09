import { Request, Response, NextFunction } from "express";
import { AppError } from "../contracts";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let { errorCode } = err;

    if (err instanceof AppError) {
        res.status(err.httpStatusCode).json({
            errorCode,
            message: err.message,
            details: err.details
        });
    } else {
        res.status(500).json({
            errorCode: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong'
        });
    }

    res.json({
        code: errorCode,
        message: err.message,
        details: err.details,
    });

    next(err);
};