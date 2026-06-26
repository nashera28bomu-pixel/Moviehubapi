/**
 * ============================================================
 * Cymor Movie API
 * Server Entry Point
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

import http from "http";
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config();

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

const PORT = process.env.PORT || 3000;

const HOST = process.env.HOST || "0.0.0.0";

/*
|--------------------------------------------------------------------------
| Create HTTP Server
|--------------------------------------------------------------------------
*/

const server = http.createServer(app);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

server.listen(PORT, HOST, () => {

    console.log("");
    console.log("======================================");
    console.log("🎬 Cymor Movie API");
    console.log("======================================");
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
    console.log(`📦 Version     : 1.0.0`);
    console.log(`👑 Creator     : Legendary Smiley Cymor`);
    console.log("======================================");
    console.log("");

});

/*
|--------------------------------------------------------------------------
| Server Error Handling
|--------------------------------------------------------------------------
*/

server.on("error", (error) => {

    console.error("❌ Server Error");

    console.error(error);

    process.exit(1);

});

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

const shutdown = (signal) => {

    console.log(`\n${signal} received.`);

    console.log("Closing server...");

    server.close(() => {

        console.log("✅ HTTP server closed.");

        process.exit(0);

    });

    setTimeout(() => {

        console.error("⚠️ Force shutdown.");

        process.exit(1);

    }, 10000);

};

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
|--------------------------------------------------------------------------
| Unhandled Errors
|--------------------------------------------------------------------------
*/

process.on("unhandledRejection", (reason) => {

    console.error("Unhandled Promise Rejection:");

    console.error(reason);

});

process.on("uncaughtException", (error) => {

    console.error("Uncaught Exception:");

    console.error(error);

});
