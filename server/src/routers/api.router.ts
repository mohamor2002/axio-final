import { Router } from "express"
import TripRouter from "./trip.router"
import RequestRouter from "./request.router"

const router = Router()

router.use("/trips", TripRouter)
router.use("/requests", RequestRouter)

export default router