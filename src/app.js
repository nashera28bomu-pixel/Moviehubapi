/**
 * ============================================================
 * Cymor Movie API
 * Express Application
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

import movieRoutes from "./routes/movie.routes.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

/*
|--------------------------------------------------------------------------
| App Configuration
|--------------------------------------------------------------------------
*/

app.disable("x-powered-by");

app.set("trust proxy", true);

/*
|--------------------------------------------------------------------------
| Security & Middlewares
|--------------------------------------------------------------------------
*/

app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);

app.use(cors());

app.use(compression());

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Root Endpoint
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

        name: "Cymor Movie API",

        version: "1.0.0",

        author: "Legendary Smiley Cymor",

        status: "online",

        documentation: "/api",

        timestamp: new Date().toISOString()

    });

});

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {

    res.status(200).json({

        success: true,

        status: "healthy",

        uptime: process.uptime(),

        memory: process.memoryUsage(),

        node: process.version,

        timestamp: new Date().toISOString()

    });

});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api", movieRoutes);

/*
|--------------------------------------------------------------------------
| Not Found Middleware
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;
