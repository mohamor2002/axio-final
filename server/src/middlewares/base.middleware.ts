import { Response, NextFunction } from "express";
import { ExtendedError } from "../types/errors";

export default class BaseMiddleware {
    static sendError(status: number = 400, error: string, res: Response) {
        return res.status(status).json({ success: false, error })
    }

    static async executeAndHandleError(callback: (...args: any) => any, res: Response, next: NextFunction) {
        try {
            await callback()
            next()
        } catch (err) {
            console.error(err)

            if (err instanceof ExtendedError) {
                return BaseMiddleware.sendError(err.getStatusCode(), err.getMessage(), res)
            }

            if (err instanceof Error) {
                return BaseMiddleware.sendError(500, err.message, res)
            }

            return BaseMiddleware.sendError(500, "Unknown error", res)
        }
    }
}