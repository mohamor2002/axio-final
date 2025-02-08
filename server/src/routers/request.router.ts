import { Router } from "express";
import RequestController from "../controllers/request.controller";

const router = Router()

router.get("/:shipper_id", RequestController.listRequests)
router.post("/planify/:request_id", RequestController.planifyRequest)
router.post("/validate/:request_id", RequestController.validateRequestPlan)
router.post("/load/:request_id/:contract_id", RequestController.loadRequest)

export default router