/**
 * ============================================================
 * Cymor Movie API
 * Global Error Handler Middleware
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

export default function errorHandler(err, req, res, next) {

    const status = err.status || err.statusCode || 500;

    const response = {
        success: false,
        status,
        error: err.name || "InternalServerError",
        message: err.message || "An unexpected error occurred.",
        timestamp: new Date().toISOString(),
        path: req.originalUrl
    };

    if (process.env.NODE_ENV !== "production") {

        response.stack = err.stack;

        response.details = err.details || null;

    }

    if (status >= 500) {

        console.error("\n========== SERVER ERROR ==========");

        console.error("Time:", response.timestamp);

        console.error("Method:", req.method);

        console.error("Path:", req.originalUrl);

        console.error("IP:", req.ip);

        console.error(err);

        console.error("==================================\n");

    }

    res.status(status).json(response);

}
