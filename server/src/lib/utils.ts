import axios from "axios";

import { config } from "dotenv"
config();

const apiKey = process.env.ORS_TOKEN;


type Edge = [number, number, number]; // [from, to, duration]
type Point = { id: number; lat: number; lon: number };

 


export function findBestRoute(durations: Edge[], start: number): { route: number[], totalDuration: number } //held-karp algorithm
 {
    const nodes = Array.from(new Set(durations.flatMap(([a, b]) => [a, b]))); // Unique nodes
    const n = nodes.length;
    const nodeIndex = new Map<number, number>(nodes.map((id, index) => [id, index]));

    if (!nodeIndex.has(start)) {
        throw new Error("Start node not found in the given edges.");
    }

    const dist: number[][] = Array(n).fill(0).map(() => Array(n).fill(Infinity));

    // Fill the distance matrix
    for (const [from, to, duration] of durations) {
        const i = nodeIndex.get(from)!;
        const j = nodeIndex.get(to)!;
        dist[i][j] = dist[j][i] = duration; // Undirected graph
    }

    const memo = new Map<string, { cost: number, path: number[] }>();

    function tsp(mask: number, pos: number): { cost: number, path: number[] } {
        if (mask === (1 << n) - 1) return { cost: 0, path: [] }; // All nodes visited

        const key = `${mask}-${pos}`;
        if (memo.has(key)) return memo.get(key)!;

        let bestCost = Infinity;
        let bestPath: number[] = [];

        for (let next = 0; next < n; next++) {
            if ((mask & (1 << next)) === 0) { // If next is unvisited
                const { cost, path } = tsp(mask | (1 << next), next);
                const newCost = dist[pos][next] + cost;

                if (newCost < bestCost) {
                    bestCost = newCost;
                    bestPath = [nodes[next], ...path];
                }
            }
        }

        memo.set(key, { cost: bestCost, path: bestPath });
        return memo.get(key)!;
    }

    const startIndex = nodeIndex.get(start)!;
    const { cost, path } = tsp(1 << startIndex, startIndex);

    return { route: [start, ...path], totalDuration: cost };
}


export async function getDurations(
    points: Point[],
    startId: number
): Promise<Edge[]> {
    const durations: Edge[] = [];

    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const from = points[i];
            const to = points[j];

            // Skip if destination is the start point
            if (to.id === startId) continue;

            const duration = await getRouteDuration(from, to); // Call API function
            durations.push([from.id, to.id, duration]);

            // Add reverse path only if `from.id` is not the start point
            if (from.id !== startId) {
                durations.push([to.id, from.id, duration]);
            }
        }
    }

    return durations;
}


export async function getRouteDuration(from: Point, to: Point): Promise<number> {
    const response = axios.post('https://api.openrouteservice.org/v2/directions/driving-car',{
        coordinates: [
            [from.lon, from.lat],
            [to.lon, to.lat]
        ]
    },{
        headers:{
            Authorization: `Bearer ${apiKey}`
        }
    })

    return response.then(res => res.data.routes[0].summary.duration);
}

export async function getRouteDistance(from: Point, to: Point): Promise<number> {
    const response = axios.post('https://api.openrouteservice.org/v2/directions/driving-car',{
        coordinates: [
            [from.lon, from.lat],
            [to.lon, to.lat]
        ]
    },{
        headers:{
            Authorization: `Bearer ${apiKey}`
        }
    })

    return response.then(res => res.data.routes[0].summary.distance);
}

