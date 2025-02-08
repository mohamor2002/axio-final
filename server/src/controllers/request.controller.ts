import { Request, Response } from "express";
import BaseController from "./base.controller";
import RequestRepository from "../repositories/request.repository";

export default class RequestController extends BaseController {
    static listRequests(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const shipper_id = BaseController.extractNumberParam(req, "shipper_id")
            return RequestRepository.listRequests(shipper_id)
        },res)
    }

    static planifyRequest(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const request_id = BaseController.extractNumberParam(req, "request_id")
            return RequestRepository.planifyRequest(request_id)
        },res)
    }

    static validateRequestPlan(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const request_id = BaseController.extractNumberParam(req, "request_id")
            const shipper_id = 1
            return RequestRepository.validateRequestPlan(request_id, shipper_id)
        },res)
    }

    static loadRequest(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const request_id = BaseController.extractNumberParam(req, "request_id")
            const contract_id = BaseController.extractNumberParam(req, "contract_id")
            return RequestRepository.loadRequest(request_id,contract_id)
        },res)
    }
}