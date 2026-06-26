/**
 * ============================================================
 * Cymor Movie API
 * Movie Controller
 * ============================================================
 */

import MovieBoxService from "../services/moviebox.service.js";

class MovieController {

    /**
     * Homepage
     */
    static async home(req, res, next) {
        try {

            const data = await MovieBoxService.home();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Trending
     */
    static async trending(req, res, next) {
        try {

            const data = await MovieBoxService.trending();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Search
     */
    static async search(req, res, next) {
        try {

            const {
                q,
                page = 1,
                perPage = 20,
                type
            } = req.query;

            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: "Missing search query."
                });
            }

            const data = await MovieBoxService.search({
                keyword: q,
                page: Number(page),
                perPage: Number(perPage),
                subjectType: type
            });

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Movie Details
     */
    static async details(req, res, next) {
        try {

            const { id } = req.params;

            const data = await MovieBoxService.details(id);

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Stream
     */
    static async stream(req, res, next) {
        try {

            const { id } = req.params;

            const {
                season = 1,
                episode = 1
            } = req.query;

            const data = await MovieBoxService.stream(
                id,
                Number(season),
                Number(episode)
            );

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Downloads
     */
    static async downloads(req, res, next) {
        try {

            const { id } = req.params;

            const {
                season = 1,
                episode = 1
            } = req.query;

            const data = await MovieBoxService.downloads(
                id,
                Number(season),
                Number(episode)
            );

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Latest Movies
     */
    static async latestMovies(req, res, next) {
        try {

            const data = await MovieBoxService.latestMovies();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Latest Series
     */
    static async latestSeries(req, res, next) {
        try {

            const data = await MovieBoxService.latestSeries();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Latest Anime
     */
    static async latestAnime(req, res, next) {
        try {

            const data = await MovieBoxService.latestAnime();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Hollywood
     */
    static async hollywood(req, res, next) {
        try {

            const data = await MovieBoxService.hollywood();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Nollywood
     */
    static async nollywood(req, res, next) {
        try {

            const data = await MovieBoxService.nollywood();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * K-Drama
     */
    static async kdrama(req, res, next) {
        try {

            const data = await MovieBoxService.kdrama();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

    /**
     * Anime Category
     */
    static async anime(req, res, next) {
        try {

            const data = await MovieBoxService.anime();

            res.json({
                success: true,
                data
            });

        } catch (err) {
            next(err);
        }
    }

}

export default MovieController;
