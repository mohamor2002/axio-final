import { equal } from "assert";
import { getRouteDistance } from "./utils";
import solver from "javascript-lp-solver/src/solver";

interface Location {
  location_id: number;
  latitude: number;
  longitude: number;
  order: number; // Order of priority (0 is the base location)
}

interface Transporter {
  transporter_id: number;
  strategy: "WEIGHT" | "DISTANCE" | "RIDE";
  unit_price: number;
  trucks: Truck[];
}

interface Truck {
  truck_id: number;
  max_weight: number;
  height: number;
  width: number;
  length: number;
  driver_id: number;
}

interface RequestProduct {
  product_id: number;
  quantity: number;
  location: Location;
  product: {
    weight: number;
    height: number;
    width: number;
    length: number;
  };
}

interface Request {
  request_id: number;
  requestProducts: RequestProduct[];
}

interface SubRequest {
  transporter: Transporter;
  assignedProducts: RequestProduct[];
}

export async function optimizeTransport(
  request: Request,
  transporters: Transporter[]
): Promise<{ subRequests: SubRequest[]; totalCost: number }> {
  const baseLocation = request.requestProducts.find(rp => rp.location.order === 0)?.location;
  if (!baseLocation) throw new Error("No base location (order 0) found in request.");

  const model: any = {
    optimize: "cost",
    opType: "min",
    constraints: {},
    variables: {},
    ints: {},
  };

  request.requestProducts = request.requestProducts.filter(rp => rp.location.order !== 0);

  for (const [rpIndex, rp] of request.requestProducts.entries()) {
    for (const [tIndex, transporter] of transporters.entries()) {
      for (const [trIndex, truck] of transporter.trucks.entries()) {
        const key = `x_${rpIndex}_${tIndex}_${trIndex}`;

        const distance = await getRouteDistance(
          { id: 0, lat: baseLocation.latitude, lon: baseLocation.longitude },
          { id: rp.location.order, lat: rp.location.latitude, lon: rp.location.longitude }
        );

        const cost = getCost(rp, transporter, distance);

        model.variables[key] = {
          cost,
          [`weight_truck_${tIndex}_${trIndex}`]:rp.product.weight,
          [`volume_truck_${tIndex}_${trIndex}`]:(rp.product.height * rp.product.width * rp.product.length),
          [`product_${rpIndex}`]: 1,
        };

        model.ints[key] = 1;

        model.constraints[`weight_truck_${tIndex}_${trIndex}`] ??= { max: truck.max_weight };
        model.constraints[`volume_truck_${tIndex}_${trIndex}`] ??= { max: truck.height * truck.width * truck.length };

        model.constraints[`product_${rpIndex}`] ??= { equal: rp.quantity };
      }
    }
  }

  const result = solver.Solve(model);
  console.log("model:", model);
  console.log("result:", result);

  const subRequestsMap = new Map<string, SubRequest>();
  let totalCost = 0;

  for (const key in result) {
    if (key.startsWith("x_") && result[key] && result[key] > 0) {
      const [_, rpIndex, tIndex, trIndex] = key.split("_").map(Number);
      const rp = request.requestProducts[rpIndex];
      const transporter = transporters[tIndex];
      const assignedQuantity = result[key];

      const distance = await getRouteDistance(
        { id: 0, lat: baseLocation.latitude, lon: baseLocation.longitude },
        { id: rp.location.order, lat: rp.location.latitude, lon: rp.location.longitude }
      );

      const cost = getCost(rp, transporter, distance) * assignedQuantity;
      totalCost += cost;

      const subKey = `${tIndex}_${trIndex}`;
      if (!subRequestsMap.has(subKey)) {
        subRequestsMap.set(subKey, {
          transporter,
          assignedProducts: [],
        });
      }

      subRequestsMap.get(subKey)!.assignedProducts.push({
        ...rp,
        quantity: assignedQuantity, // Correct quantity
      });
    }
  }

  return { subRequests: Array.from(subRequestsMap.values()), totalCost };
}


// Helper function to calculate cost based on strategy
function getCost(rp: RequestProduct, transporter: Transporter, distance: number): number {
  switch (transporter.strategy) {
    case "WEIGHT": return transporter.unit_price * rp.product.weight;
    case "DISTANCE": return transporter.unit_price * distance;
    case "RIDE": return transporter.unit_price
  }
}
