import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create a shipper
  const shipper = await prisma.shipper.create({
    data: {
      company_name: "Fast Freight",
      phone: "1234567890",
    },
  });

  // Create an offer
  const offer = await prisma.offer.create({
    data: {
      title: "Premium Shipping Plan",
      description: "Fast and secure shipping for all your goods.",
      price: 499.99,
      duration: 30,
    },
  });

  // Subscribe the shipper to an offer
  await prisma.subscription.create({
    data: {
      shipper_id: shipper.shipper_id,
      offer_id: offer.offer_id,
      start_date: new Date(),
    },
  });

  // Create a transporter
  const transporter = await prisma.transporter.create({
    data: {
      full_name: "Global Transport Inc.",
      phone: "0987654321",
      strategy: "WEIGHT",
      unit_price: 5.5,
    },
  });
  
  const transporter2 = await prisma.transporter.create({
    data: {
      full_name: "Global Transport Inc.",
      phone: "0987654321",
      strategy: "DISTANCE",
      unit_price: 5.5,
    },
  });


  // Create a driver
  
  // Create a truck
  const truck = await prisma.truck.create({
      data: {
          model: "Volvo FH16",
          plate: "ABC-1234",
          height: 40,
          width: 25,
          length: 12,
          max_weight: 40000,
          transporter_id: transporter.transporter_id,
        },
    });

    const truck2 = await prisma.truck.create({
      data: {
          model: "HMC 6x4",
          plate: "DEF-5678",
          height: 40,
          width: 25,
          length: 12,
          max_weight: 40000,
          transporter_id: transporter2.transporter_id,
        },
    });

    const truck3 = await prisma.truck.create({
      data: {
          model: "HMC 6x4",
          plate: "DEF-5678",
          height: 40,
          width: 25,
          length: 12,
          max_weight: 40000,
          transporter_id: transporter2.transporter_id,
        },
    });
    
    const driver = await prisma.driver.create({
      data: {
        full_name: "John Doe",
        phone: "5551234567",
        transporter_id: transporter.transporter_id,
        truck_id:truck.truck_id
      },
    });

    const driver2 = await prisma.driver.create({
      data: {
        full_name: "John Doe",
        phone: "5551234567",
        transporter_id: transporter2.transporter_id,
        truck_id:truck2.truck_id
      },
    });

    const driver3 = await prisma.driver.create({
      data: {
        full_name: "John Doe",
        phone: "5551234567",
        transporter_id: transporter2.transporter_id,
        truck_id:truck3.truck_id
      },
    })
  // Create a contract
  const contract = await prisma.contract.create({
    data: {
      shipper_id: shipper.shipper_id,
      transporter_id: transporter.transporter_id,
      date: new Date(),
    },
  });

  // Create a trip with 10 locations
  const trip = await prisma.trip.create({
    data: {
      contract_id: contract.contract_id,
      predefined_start_date: new Date(),
      predefined_end_date: new Date(new Date().setDate(new Date().getDate() + 2)),
      actual_start_date: new Date(),
      driver_id: driver.driver_id,
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      contract_id: contract.contract_id,
      predefined_start_date: new Date(),
      predefined_end_date: new Date(new Date().setDate(new Date().getDate() + 2)),
      actual_start_date: new Date(),
      driver_id: driver.driver_id,
    },
  })

  const trip3 = await prisma.trip.create({
    data: {
      contract_id: contract.contract_id,
      predefined_start_date: new Date(),
      predefined_end_date: new Date(new Date().setDate(new Date().getDate() + 2)),
      actual_start_date: new Date(),
      driver_id: driver.driver_id,
    },
  })

  const routePlan = await prisma.routePlan.create({
    data: {
      trip_id: trip.trip_id,
      truck_id: truck.truck_id,
    },
  });

  // Create 10 locations for the trip
  for (let i = 0; i < 5; i++) {
    await prisma.location.create({
      data: {
        route_plan_id: routePlan.route_plan_id,
        unloadingTime: Math.floor(Math.random() * 60),
        name: `Location ${i + 1}`,
        longitude:  5.4108+ (Math.random() % 20)/40,
        latitude: 36.1898 + (Math.random() % 20)/40,
        order: i,
      },
    });
  }

  const products = await prisma.product.createMany({
    data: [
      {
        name: "Glassware",
        weight: 5.5,
        height: 10,
        width: 5,
        length: 5,
        type: "FRAGILE",
        shipper_id: shipper.shipper_id,
      },
      {
        name: "Battery",
        weight: 8.2,
        height: 12,
        width: 6,
        length: 6,
        type: "DANGEROUS",
        shipper_id: shipper.shipper_id,
      },
      {
        name: "Boxes of Books",
        weight: 20.0,
        height: 15,
        width: 10,
        length: 10,
        type: "NORMAL",
        shipper_id: shipper.shipper_id,
      },
      {
        name: "Water Bottles",
        weight: 10.0,
        height: 10,
        width: 5,
        length: 5,
        type: "NORMAL",
        shipper_id: shipper.shipper_id,
      }
    ],
  });

  const request = await prisma.request.create({
    data: {
      shipper_id: shipper.shipper_id,
    },
  });

  
  const productList = await prisma.product.findMany({
    where: { shipper_id: shipper.shipper_id },
  });

  const locationList = await prisma.location.findMany({
    where: { 
      route_plan_id: routePlan.route_plan_id,
     },
  });

  await prisma.requestProduct.create({
    data: {
      request_id: request.request_id,
      product_id: productList[0].product_id,
      quantity: 0,
      location_id: locationList[0].location_id,
    },
  })
 
  await prisma.requestProduct.create({
    data: {
      request_id: request.request_id,
      product_id: productList[1].product_id,
      quantity: 12,
      location_id: locationList[3].location_id,
    },
  })

  await prisma.requestProduct.create({
    data: {
      request_id: request.request_id,
      product_id: productList[2].product_id,
      quantity: 14,
      location_id: locationList[4].location_id,
    },
  })

  await prisma.requestProduct.create({
    data: {
      request_id: request.request_id,
      product_id: productList[3].product_id,
      quantity: 20,
      location_id: locationList[1].location_id,
    },
  })

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
