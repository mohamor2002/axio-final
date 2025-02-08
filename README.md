# Axio : Optimisez, Chargez, Livrez!

## Solution Explanation

The Axio system is designed to optimize logistics operations by addressing four key problems:
- **Route Optimization**
- **Planification (Load Distribution)**
- **Space Management**
- **Reactivity and Tracking**

It consists of an **Express.js** server (for API interactions and computations) and a **FastAPI** server (for running machine learning models and simulations).

---

## Problem Breakdown & Solution Approach

### 1. Route Optimization
**Challenge:** Finding the optimal path for transporters to minimize travel time and cost.

**Solution:**
- Used **Operational Research (OR) techniques** to model the routing problem as a graph.
- Leveraged the **ORS (OpenRouteService) API** to obtain travel duration (weights between points).
- Since real-world station counts are typically **≤ 20**, the **Held-Karp algorithm** (Dynamic Programming approach for solving TSP) was used to compute the optimal routes efficiently.

---

### 2. Planification (Load Distribution)
**Challenge:** Assigning shipments to available transporters while optimizing cost and efficiency.

**Solution:**
- Input: **List of orders** (with product quantities for each location), **available transporters** (with truck capacities & payment strategies).
- Used **Linear Programming (LP)** to model the load distribution problem.
- Solved for optimal allocation of quantities to each truck, ensuring cost-effectiveness and efficient utilization of available vehicles.

---

### 3. Space Management
**Challenge:** Packing goods in a way that minimizes space wastage while maintaining balance.

**Solution:**
- Developed a **3D bin-packing optimization** algorithm in Python.
- Used **simulation-based algorithms** to efficiently pack goods, minimizing empty space and ensuring balanced weight distribution.
- Considered **gravitational balance constraints** to prevent instability during transport.

---

### 4. Reactivity and Tracking
**Challenge:** Maintaining real-time communication between shippers and drivers.

**Solution:**
- Developed a **mobile app for drivers** to enable real-time tracking and communication.
- Ensured continuous data exchange between shippers and drivers for transparency and visibility.
- Integrated GPS-based tracking for improved logistics management.

---

## System Components & Setup

### **Server (Express + TypeScript)**
This RESTful API manages optimization computations and CRUD operations.

#### Setup and Run:
1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up the `.env` file:
   ```sh
   PORT=5000
   DATABASE_URL=<your_mysql_db_url>
   ORS_TOKEN=5b3ce3597851110001cf6248187e277eafa54fa5807e37490556e28d
   ```
3. Seed the database:
   ```sh
   npm run db:seed
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

---

### **Load Model (FastAPI)**
This server handles space management optimization using Python algorithms.

#### Setup and Run:
1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Start the server:
   ```sh
   uvicorn app:server --reload
   ```
3. The server runs on `http://localhost:8000`

---

## Documentation
- Postman API Documentation: [Link](https://speeding-space-917514.postman.co/workspace/My-Workspace~aceaa595-e7f8-4e6e-83d5-036601c4cf8c/collection/23659944-9b0a6b5f-2fa3-4a94-970d-3416162ac23f?action=share&creator=23659944)

---

## Notes
- Ensure all dependencies are installed before running the servers.
- Verify environment variables and `.env` configuration before starting the Express server.
- The FastAPI server should be accessible on port `8000`.
- Visualization outputs for truck loading processes are stored in `load_model/outputs/truck(i)`.
- Check out the **Driver Mobile App** and **Shipper Portal Front-End App** repositories for further integration details.

---

