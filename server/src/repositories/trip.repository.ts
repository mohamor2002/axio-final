import RepositoryResponse from "../types/repository_response";
import { prisma } from "../index";
import { ExtendedError } from "../types/errors";
import {findBestRoute, getDurations, getRouteDistance} from "../lib/utils"


type Point = { id: number; lat: number; lon: number };


export default class TripRepository {
    static async listTrips(shipper_id:number): Promise<RepositoryResponse> {
        const trips = await prisma.trip.findMany({
            where:{
                contract:{
                    shipper_id:shipper_id
                }
            },
            include:{
                contract:{
                    select:{
                        contract_id:true,
                        transporter_id:true,
                        date:true,
                        transporter:true
                    },
                },
                route_plans:{
                    select:{
                        locations:true
                    }
                }
                

                
            }
        })

        

        return {
            data: trips,
            status: 200,
            success: true
        }
    }

    static async createTrip(trip: any,locations:any): Promise<RepositoryResponse> {
        const newTrip = await prisma.trip.create({
            data:{
                contract_id:trip.contract_id,
                predefined_start_date:trip.predefined_start_date,
                predefined_end_date:trip.predefined_end_date,
                actual_start_date:trip.actual_start_date,
                driver_id:trip.driver_id
            }
        })

        
        const routePlan = await prisma.routePlan.create({
            data:{
                trip_id:newTrip.trip_id,
                truck_id:trip.truck_id,
            }
        })
        
        const locs = locations.map((loc:any)=>{
            const location = prisma.location.create({
                data:{
                    route_plan_id:routePlan.route_plan_id,
                    unloadingTime:locations.unloadingTime,
                    name:locations.name,
                    longitude:locations.longitude, 
                    latitude:locations.latitude,
                }
            })
            return location
        })

        const requestProducts = locations.map((loc:any)=>{
            const productRequest = prisma.requestProduct.create({
                data:{
                    location_id:loc.location_id,
                    product_id:loc.product_id,
                    request_id:trip.request_id,
                    quantity:loc.quantity,

                }
            })
            return productRequest
        })
        
        return{
            data:newTrip,
            status:200,
            success:true
        }
    }

    static async optimizeRoute(trip:number): Promise<RepositoryResponse> {
        const uniqueTrip = await prisma.trip.findUnique({
            where:{
                trip_id:trip
            }
        })
        if(!uniqueTrip){
            throw new ExtendedError(404, "Trip not found")
        }
        const rp = await prisma.routePlan.findFirst({
            where:{
                trip_id:trip,
            },
            select:{
                route_plan_id:true,
                locations:true
            }
        })
        if(!rp){
            throw new ExtendedError(404, "Route Plan not found")
        }

        const locations = rp.locations.map((loc:any)=>{
            return {
                id:loc.location_id,
                lat:loc.latitude,
                lon:loc.longitude
            }
        })

        const startId = locations[0].id;
        const durations = await getDurations(locations, startId);
        const route = findBestRoute(durations, startId);

        const newRp= await prisma.routePlan.update({
            where:{
                route_plan_id:rp.route_plan_id
            },
            data:{
                optimized:true,
                locations:{
                    update:route.route.map((loc:number,index:number)=>{
                        return{
                            where:{
                                location_id:loc
                            },
                            data:{
                                order:index
                            }
                        }
                    })
                },
                duration:route.totalDuration,
                date: new Date(),
            },
            select:{
                route_plan_id:true,
                locations:true
            }
        })




        


        return {
            data: {
                route: newRp,
                totalDuration: route.totalDuration
            },
            status: 200,
            success: true
        }
    }

    static async getNumberOfOptimizedTrips(shipper_id:number): Promise<RepositoryResponse> {
        const rp = await prisma.routePlan.findMany({
            where:{
                trip:{
                    contract:{
                        shipper_id:shipper_id
                    }
                },
                optimized:true
            }
        })

        

        return {
            data: rp.length,
            status: 200,
            success: true
        }
    }

    static async getNumberOfOptimizedRoutes(shipper_id:number): Promise<RepositoryResponse> {
        const rp = await prisma.routePlan.findMany({
            where:{
                trip:{
                    contract:{
                        shipper_id:shipper_id
                    }
                },
                optimized:true
            },
            select:{
                locations:true
            }
        })

        

        return {
            data: rp.reduce((acc:number,curr:any)=>{
                return acc+curr.locations.length
            },0),
            status: 200,
            success: true
        }
    }

    static async getOptimizedTripPlan(trip:number): Promise<RepositoryResponse> {
        const rp = await prisma.routePlan.findFirst({
            where:{
                trip_id:trip,
                optimized:true
            },
            select:{
                route_plan_id:true,
                locations:true,
                trip:true,
                truck:true
            }
        })

        if(!rp){
            throw new ExtendedError(404, "Route Plan not found")
        }

        return {
            data: rp,
            status: 200,
            success: true
        }
    }

    static async getHistoryOfOptimizations(shipper_id:number): Promise<RepositoryResponse> {
        const rp = await prisma.routePlan.findMany({
            where:{
                trip:{
                    contract:{
                        shipper_id:shipper_id
                    }
                },
                optimized:true
            },
            select:{
                route_plan_id:true,
                locations:true,
                duration:true,
                date:true
            }
        })

        

        return {
            data: rp,
            status: 200,
            success: true
        }
    }

    static async getDriverTripsHistory(driver_id: number, page: number = 1, limit: number = 20): Promise<RepositoryResponse> {
        const offset = (page - 1) * limit;
    
        const trips = await prisma.trip.findMany({
            where: { driver_id: driver_id },
            include: {
                contract: {
                    select: {
                        contract_id: true
                    }
                },
                route_plans: {
                    include: {
                        locations: {
                            select: {
                                name: true,
                                latitude: true,
                                longitude: true,
                                unloadingTime: true
                            }
                        }
                    }
                }
            },
            skip: offset,
            take: limit
        });
    
        const totalItems = await prisma.trip.count({
            where: { driver_id: driver_id }
        });
    
        // **Fix: Wait for all async operations inside `map()`**
        const formattedTrips = await Promise.all(trips.map(async (trip) => {
            const startLocation = trip.route_plans?.[0]?.locations?.[0];
            const endLocation = trip.route_plans?.[0]?.locations?.slice(-1)[0];
    
            return {
                id: `del_${trip.trip_id}`,
                missionId: `mission_${trip.contract?.contract_id || 'N/A'}`,
                destination: endLocation?.name || "Unknown",
                startDate: trip.predefined_start_date.toISOString(),
                endDate: trip.predefined_end_date
                    ? trip.predefined_end_date.toISOString()
                    : trip.actual_start_date?.toISOString(),
                distance: startLocation && endLocation
                    ? await getRouteDistance(
                        { id: 1, lat: startLocation.latitude, lon: startLocation.longitude },
                        { id: 1, lat: endLocation.latitude, lon: endLocation.longitude }
                    )
                    : 0, // Default distance if locations are missing
                stops: trip.route_plans?.[0]?.locations?.map(loc => ({
                    address: loc.name,
                    arrivalTime: loc.unloadingTime+" Minutes"|| "Unknown",
                    status: "pending"
                })) || [],
                status: "pending",
                rating: 4
            };
        }));
    
        return {
            data: formattedTrips,
            status: 200,
            success: true
        };
    }
    
    

}
