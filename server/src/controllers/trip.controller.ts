import { Request, Response } from "express";
import BaseController from "./base.controller";
import TripRepository from "../repositories/trip.repository";

export default class TripController extends BaseController {
    static listTrips(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const shipper_id = BaseController.extractNumberParam(req, "shipper_id")
            return TripRepository.listTrips(shipper_id)
            
        },res)
    }

    static optimizeRoute(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const trip_id = BaseController.extractNumberParam(req, "trip_id")
            return TripRepository.optimizeRoute(trip_id)
        },res)
    }

    static getNumberOfOptimizedTrips(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const shipper_id = BaseController.extractNumberParam(req, "shipper_id")
            return TripRepository.getNumberOfOptimizedTrips(shipper_id)
        },res)
    }

    static getNumberOfOptimizedRoutes(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const shipper_id = BaseController.extractNumberParam(req, "shipper_id")
            return TripRepository.getNumberOfOptimizedRoutes(shipper_id)
        },res)
    }

    static getOptimizedTripPlan(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const trip_id = BaseController.extractNumberParam(req, "trip_id")
            return TripRepository.getOptimizedTripPlan(trip_id)
        },res)
    }

    static getHistoryOfOptimizations(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const shipper_id = BaseController.extractNumberParam(req, "shipper_id")
            return TripRepository.getHistoryOfOptimizations(shipper_id)
        },res)
    }

    static getDriverTripsHistory(req: Request, res: Response) {
        super.executeAndHandleError(() => {
            const driver_id = BaseController.extractNumberParam(req, "driver_id")
            const page = BaseController.extractNumberParam(req, "page")
            return TripRepository.getDriverTripsHistory(driver_id,page)
        },res)
    }
}
