import { Request, Response, NextFunction } from 'express';

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncRequestHandler) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await fn(req, res, next);
        } catch (error: any) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            });
            // next(error); // Pass the error to the next middleware (error handler)
        }
    };
};

export { asyncHandler };