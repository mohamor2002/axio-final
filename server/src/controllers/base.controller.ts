import { Request, Response } from "express";
import { ExtendedError } from "../types/errors";
import RepositoryResponse from "../types/repository_response";

export default class BaseController {
    private static sendResponse(status: number = 200, data: any, success: boolean, res: Response) {
        return res.status(status).json({ success, data })
    }

    private static sendError(status: number = 400, error: string, res: Response) {
        return res.status(status).json({ success: false, error })
    }

    protected static async executeAndHandleError(callback: (...args: any) => Promise<RepositoryResponse>, res: Response) {
        try {
            const { data, status, success } = await callback()

            return BaseController.sendResponse(status, data, success, res)
        } catch (err) {
            console.error(err)

            if (err instanceof ExtendedError) {
                return BaseController.sendError(err.getStatusCode(), err.getMessage(), res)
            }

            if (err instanceof Error) {
                return BaseController.sendError(500, err.message, res)
            }

            return BaseController.sendError(500, "Unknown error", res)
        }
    }

    protected static extractStringParam(req: Request, param: string): string {
        const value = req.params[param]
        console.log(req.params)
        if (!(typeof value === "string")) {
            throw new ExtendedError(400, `The parameter ${param} must be a string`)
        }

        if (value === "")  {
            throw new ExtendedError(400, `Missing parameter ${param}`)
        }

        return req.params[param]
    }

    protected static extractNumberParam(req: Request, param: string): number {
        let value: any = req.params[param]

        if (!value) {
            throw new ExtendedError(400, `Missing parameter ${param}`)
        }

        value = Number(value)

        if (isNaN(value)) {
            throw new ExtendedError(400, `The parameter ${param} must be a number`)
        }

        return value
    }

    protected static extractNumberQuery(req: Request, key: string): number {
        let value = req.body[key]

        if (!value) {
            throw new ExtendedError(400, `Missing field ${key}`)
        }

        value = Number(value)

        if (isNaN(value)) {
            throw new ExtendedError(400, `The field ${key} value must be number`)
        }

        return value
    }

    protected static extractStringQuery(req: Request, key: string): string {
        const value = req.body[key]

        if (typeof value !== "string") {
            throw new ExtendedError(400, `Invalid field ${key}`)
        }

        if (value === "") {
            throw new ExtendedError(400, `Missing field ${key} value`)
        }

        return value
    }
}