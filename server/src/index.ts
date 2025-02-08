import express, { Express, Request, Response, json, urlencoded } from "express"
import { config } from "dotenv"
import APIRouter from "./routers/api.router"
import { PrismaClient } from "@prisma/client"
import cors from 'cors'

config()

const app: Express = express()

app.use(cors({
    origin: '*'
}));

export const prisma = new PrismaClient()
const PORT = process.env.PORT || 8000

async function main() {

    app.all("/api/", (req: Request, res: Response) => {
        res.send("The API works correctly")
    })
    app.all("/api/admin", (req: Request, res: Response) => {
        res.send("The API works correctly")
    })


    app.use(urlencoded({
        extended: true,
        limit: "50mb"
    }))

    app.use(json({
        limit: "50mb"
    }))

    app.use("/api", APIRouter)

    app.listen(PORT, () => {
        console.log(`[server]: Server is running at http://localhost:${PORT}`)
    })
}

main()
    .then(async () => {
        await prisma.$connect()
        console.log(`[server]: Connected to DB`)
    })
    .catch(async (err) => {
        console.error(err)
        await prisma.$disconnect()
        process.exit(1)
    })