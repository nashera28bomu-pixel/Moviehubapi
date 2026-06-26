/**
 * ============================================================
 * Cymor Movie API
 * 404 Not Found Middleware
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

export default function notFound(req, res, next) {

    res.status(404).json({

        success: false,

        status: 404,

        error: "NotFound",

        message: "The requested endpoint does not exist.",

        method: req.method,

        path: req.originalUrl,

        timestamp: new Date().toISOString(),

        availableEndpoints: {

            home: "/api/home",

            trending: "/api/trending",

            search: "/api/search?q=avatar",

            details: "/api/details/:id",

            stream: "/api/stream/:id",

            downloads: "/api/downloads/:id",

            latestMovies: "/api/latest/movies",

            latestSeries: "/api/latest/series",

            latestAnime: "/api/latest/anime",

            hollywood: "/api/hollywood",

            nollywood: "/api/nollywood",

            kdrama: "/api/kdrama",

            anime: "/api/anime"

        }

    });

}
