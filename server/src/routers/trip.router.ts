import { Router } from "express";
import TripController from "../controllers/trip.controller";

const router = Router()

router.get("/:shipper_id", TripController.listTrips)
router.post("/optimize/:trip_id", TripController.optimizeRoute)
router.get("/optimized/:shipper_id", TripController.getNumberOfOptimizedTrips)
router.get("/optimized/routes/:shipper_id", TripController.getNumberOfOptimizedRoutes)
router.get("/optimized/plan/:trip_id", TripController.getOptimizedTripPlan)
router.get("/optimized/history/:shipper_id", TripController.getHistoryOfOptimizations)
router.get("/driver/history/:driver_id/:page", TripController.getDriverTripsHistory)

export default router