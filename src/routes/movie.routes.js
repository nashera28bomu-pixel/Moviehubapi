/**
 * ============================================================
 * Cymor Movie API
 * Movie Routes
 * ============================================================
 */

import { Router } from "express";

import MovieController from "../controllers/movie.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

router.get("/", (req, res) => {

    res.json({
        success: true,
        name: "Cymor Movie API",
        version: "1.0.0",
        status: "online",
        author: "Legendary Smiley Cymor"
    });

});

/*
|--------------------------------------------------------------------------
| Homepage
|--------------------------------------------------------------------------
*/

router.get("/home", MovieController.home);

router.get("/trending", MovieController.trending);

router.get("/latest/movies", MovieController.latestMovies);

router.get("/latest/series", MovieController.latestSeries);

router.get("/latest/anime", MovieController.latestAnime);

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
*/

router.get("/hollywood", MovieController.hollywood);

router.get("/nollywood", MovieController.nollywood);

router.get("/kdrama", MovieController.kdrama);

router.get("/anime", MovieController.anime);

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

router.get("/search", MovieController.search);

/*
|--------------------------------------------------------------------------
| Movie Details
|--------------------------------------------------------------------------
*/

router.get("/details/:id", MovieController.details);

/*
|--------------------------------------------------------------------------
| Streaming
|--------------------------------------------------------------------------
*/

router.get("/stream/:id", MovieController.stream);

/*
|--------------------------------------------------------------------------
| Downloads
|--------------------------------------------------------------------------
*/

router.get("/downloads/:id", MovieController.downloads);

/*
|--------------------------------------------------------------------------
| Future Categories
|--------------------------------------------------------------------------
*/

router.get("/action", async (req, res, next) => {

    try {

        const data = await MovieController.search({

            query: {
                q: "Action"
            }

        }, res, next);

        return data;

    } catch (err) {

        next(err);

    }

});

router.get("/comedy", async (req, res, next) => {

    try {

        const data = await MovieController.search({

            query: {
                q: "Comedy"
            }

        }, res, next);

        return data;

    } catch (err) {

        next(err);

    }

});

router.get("/romance", async (req, res, next) => {

    try {

        const data = await MovieController.search({

            query: {
                q: "Romance"
            }

        }, res, next);

        return data;

    } catch (err) {

        next(err);

    }

});

router.get("/horror", async (req, res, next) => {

    try {

        const data = await MovieController.search({

            query: {
                q: "Horror"
            }

        }, res, next);

        return data;

    } catch (err) {

        next(err);

    }

});

router.get("/animation", async (req, res, next) => {

    try {

        const data = await MovieController.search({

            query: {
                q: "Animation"
            }

        }, res, next);

        return data;

    } catch (err) {

        next(err);

    }

});

router.get("/documentary", async (req, res, next) => {

    try {

        const data = await MovieController.search({

            query: {
                q: "Documentary"
            }

        }, res, next);

        return data;

    } catch (err) {

        next(err);

    }

});

router.get("/family", async (req, res, next) => {

    try {

        const data = await MovieController.search({

            query: {
                q: "Family"
            }

        }, res, next);

        return data;

    } catch (err) {

        next(err);

    }

});

/*
|--------------------------------------------------------------------------
| 404 API Route
|--------------------------------------------------------------------------
*/

router.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Endpoint not found."

    });

});

export default router;
