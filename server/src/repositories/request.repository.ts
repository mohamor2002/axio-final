import RepositoryResponse from "../types/repository_response";
import { prisma } from "../index";
import { ExtendedError } from "../types/errors";
import {optimizeTransport} from "../lib/planning"
import axios from "axios";

export default class RequestRepository {
    static async listRequests(shipper_id:number): Promise<RepositoryResponse> {
        const requests = await prisma.request.findMany({
            where:{
                shipper_id:shipper_id
            },
            include:{
                requestProducts:{
                    select:{
                        quantity:true,
                        product:true,
                        location:true
                    }
                }
            }
        })

        return {
            data: requests,
            status: 200,
            success: true
        }
    }

    static async planifyRequest(request_id:number): Promise<RepositoryResponse> {

        const request = await prisma.request.findUnique({
            where:{
                request_id:request_id
            },
            include:{
                requestProducts:{
                    select:{
                        quantity:true,
                        product:true,
                        location:true
                    }
                }
            }
        })

        if (!request) {
            throw new ExtendedError(404, "Request not found")
        }

        const transporters = await prisma.transporter.findMany({
            include:{
                trucks:{
                    include:{
                        driver:true
                    }
                }
            }
        })

        const {subRequests,totalCost} = await optimizeTransport({
            request_id:request_id,
            requestProducts:request.requestProducts.map(rp => ({
                product_id:rp.product.product_id,
                quantity:rp.quantity,
                location:rp.location,
                product:{
                    weight:rp.product.weight,
                    height:rp.product.height,
                    width:rp.product.width,
                    length:rp.product.length
                }
            }))
        },
        transporters.map(transporter => (
            {
                transporter_id:transporter.transporter_id,
                unit_price:transporter.unit_price,
                strategy:transporter.strategy,
                trucks:transporter.trucks.map(truck => ({
                    truck_id:truck.truck_id,
                    max_weight:truck.max_weight,
                    height:truck.height,
                    width:truck.width,
                    length:truck.length,
                    driver_id:truck.driver.driver_id
                })) 
            }
        )
        )
        )


        return{
            data: {
                subRequests,
                totalCost
            },
            status: 200,
            success: true
        }
    }


    static async validateRequestPlan(request_id: number, shipper_id: number): Promise<RepositoryResponse> {
        const request = await prisma.request.findUnique({
            where: { request_id },
            include: {
                requestProducts: {
                    select: {
                        quantity: true,
                        product: true,
                        location: true
                    }
                }
            }
        });
    
        if (!request) {
            throw new ExtendedError(404, "Request not found");
        }
    
        const transporters = await prisma.transporter.findMany({
            include:{
                trucks:{
                    include:{
                        driver:true
                    }
                }
            }
        })

        const { subRequests, totalCost } = await optimizeTransport(
            {
                request_id,
                requestProducts: request.requestProducts.map(rp => ({
                    product_id: rp.product.product_id,
                    quantity: rp.quantity,
                    location: rp.location,
                    product: {
                        weight: rp.product.weight,
                        height: rp.product.height,
                        width: rp.product.width,
                        length: rp.product.length
                    }
                }))
            },
            transporters.map(transporter => ({
                transporter_id: transporter.transporter_id,
                unit_price: transporter.unit_price,
                strategy: transporter.strategy,
                trucks: transporter.trucks.map(truck => ({
                    truck_id: truck.truck_id,
                    max_weight: truck.max_weight,
                    height: truck.height,
                    width: truck.width,
                    length: truck.length,
                    driver_id: truck.driver.driver_id
                }))
            }))
        );
    
        for (const subRequest of subRequests) {
            const contract = await prisma.contract.create({
                data: {
                    shipper_id,
                    transporter_id: subRequest.transporter.transporter_id,
                    date: new Date()
                }
            });
    
            // Create trips only for the assigned truck(s) for this subRequest
            for (const product of subRequest.assignedProducts) {
                const assignedTruck = subRequest.transporter.trucks.find(truck =>
                    product.product_id === product.product_id // Ensure the truck is used for this product
                );

                
                if (assignedTruck) {
                    const trip = await prisma.trip.create({
                        data: {
                            contract_id: contract.contract_id,
                            driver_id: assignedTruck.driver_id
                        }
                    });
                    
                    const rp=await prisma.routePlan.create({
                        data:{
                            trip_id:trip.trip_id,
                            truck_id:assignedTruck.truck_id
                        }
                    })

                    await prisma.requestProduct.create({
                        data: {
                            request_id,
                            product_id: product.product_id,
                            quantity: product.quantity,
                            location_id: product.location.location_id
                        }
                    });

                    const loc = await prisma.location.update({
                        where:{
                            location_id:product.location.location_id,
                        },
                        data:{
                            route_plan_id:rp.route_plan_id,
                            order:product.location.order
                        }   
                    })

                }


            }
            
            
        }
    
        return {
            data: { subRequests, totalCost },
            status: 200,
            success: true
        };
    }

    static async loadRequest(request_id: number, contract_id: number): Promise<RepositoryResponse> {
        const request = await prisma.request.findUnique({
            where: { request_id },
            include: {
                requestProducts: {
                    select: {
                        quantity: true,
                        product: {
                            select: {
                                product_id: true,
                                name: true,
                                weight: true,
                                width: true,
                                height: true,
                                length: true
                            }
                        }
                    }
                }
            }
        });
    
        if (!request) {
            throw new ExtendedError(404, "Request not found");
        }
    
        const contract = await prisma.contract.findUnique({
            where: { contract_id },
            include: {
                transporter: {
                    include: {
                        trucks: {
                            include: {
                                driver: true
                            }
                        }
                    }
                }
            }
        });
    
        if (!contract || !contract.transporter) {
            throw new ExtendedError(404, "Contract or transporter not found");
        }
    
        const boxes = request.requestProducts.flatMap(rp =>
            Array.from({ length: rp.quantity }, (_, i) => ({
                partno: `box ${i}${rp.product.product_id}`,
                name: `${rp.product.name} ${i}`,
                typeof: "box",
                weight: rp.product.weight,
                level: 1,
                loadbear: 100,
                updown: true,
                color: "red",
                WHD: [rp.product.width, rp.product.height, rp.product.length]
            }))
        );
    
        const bins = contract.transporter.trucks.map(truck => ({
            partno: `truck ${truck.truck_id}`,
            WHD: [truck.width, truck.height, truck.length],
            max_weight: truck.max_weight
        }));
    
        console.log(JSON.stringify({ bins, boxes }, null, 2)); // Debugging output
    
        let response;
    
        try {
            response = await axios.post("http://localhost:8000/pack", { bins, boxes }, {
                headers: { "Content-Type": "application/json" } // Explicitly set JSON headers
            });
        } catch (error) {
            console.error("Error sending request:", error?.response?.data || error);
            throw new ExtendedError(500, "Error loading request");
        }
    
        return {
            data: response.data,
            status: 200,
            success: true
        };
    }
    

    
}