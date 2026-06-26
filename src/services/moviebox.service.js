/**
 * ============================================================
 * Cymor Movie API
 * MovieBox Service
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

import api from "../config/axios.js";
import cache from "../config/cache.js";

class MovieBoxService {

    constructor() {

        this.endpoints = {

            home: "/wefeed-h5api-bff/home",

            trending: "/wefeed-h5api-bff/trending",

            search: "/wefeed-h5api-bff/search",

            details: "/wefeed-h5api-bff/subject/detail",

            download: "/wefeed-h5api-bff/download",

            stream: "/wefeed-h5api-bff/play"

        };

    }

    /**
     * Generic GET
     */
    async get(endpoint, params = {}, ttl = 300) {

        const key =
            endpoint +
            ":" +
            JSON.stringify(params);

        return cache.remember(

            key,

            async () => {

                const response =
                    await api.get(

                        endpoint,

                        {

                            params

                        }

                    );

                return response.data.data;

            },

            ttl

        );

    }

    /**
     * Homepage
     */
    async home() {

        return this.get(

            this.endpoints.home,

            {},

            300

        );

    }

    /**
     * Trending
     */
    async trending() {

        return this.get(

            this.endpoints.trending,

            {},

            180

        );

    }

    /**
     * Search
     */
    async search({

        keyword,

        page = 1,

        perPage = 20,

        subjectType

    }) {

        const params = {

            keyword,

            page,

            perPage

        };

        if (subjectType) {

            params.subjectType = subjectType;

        }

        return this.get(

            this.endpoints.search,

            params,

            120

        );

    }

    /**
     * Movie Details
     */
    async details(subjectId) {

        return this.get(

            this.endpoints.details,

            {

                subjectId

            },

            600

        );

    }

    /**
     * Stream
     */
    async stream(

        subjectId,

        season = 1,

        episode = 1

    ) {

        return this.get(

            this.endpoints.stream,

            {

                subjectId,

                season,

                episode

            },

            300

        );

    }

    /**
     * Downloads
     */
    async downloads(

        subjectId,

        season = 1,

        episode = 1

    ) {

        return this.get(

            this.endpoints.download,

            {

                subjectId,

                season,

                episode

            },

            300

        );

    }

    /**
     * Latest Movies
     */
    async latestMovies() {

        return this.search({

            keyword: "",

            subjectType: "MOVIES"

        });

    }

    /**
     * Latest Series
     */
    async latestSeries() {

        return this.search({

            keyword: "",

            subjectType: "TV_SERIES"

        });

    }

    /**
     * Latest Anime
     */
    async latestAnime() {

        return this.search({

            keyword: "",

            subjectType: "ANIME"

        });

    }

    /**
     * Hollywood
     */
    async hollywood() {

        return this.search({

            keyword: "Hollywood"

        });

    }

    /**
     * Nollywood
     */
    async nollywood() {

        return this.search({

            keyword: "Nollywood"

        });

    }

    /**
     * Korean Drama
     */
    async kdrama() {

        return this.search({

            keyword: "Korean Drama"

        });

    }

    /**
     * Anime
     */
    async anime() {

        return this.search({

            keyword: "Anime"

        });

    }

    /**
     * Action
     */
    async action() {

        return this.search({

            keyword: "Action"

        });

    }

    /**
     * Comedy
     */
    async comedy() {

        return this.search({

            keyword: "Comedy"

        });

    }

    /**
     * Horror
     */
    async horror() {

        return this.search({

            keyword: "Horror"

        });

    }

    /**
     * Romance
     */
    async romance() {

        return this.search({

            keyword: "Romance"

        });

    }

    /**
     * Sci-Fi
     */
    async sciFi() {

        return this.search({

            keyword: "Science Fiction"

        });

    }

    /**
     * Documentary
     */
    async documentary() {

        return this.search({

            keyword: "Documentary"

        });

    }

    /**
     * Family
     */
    async family() {

        return this.search({

            keyword: "Family"

        });

    }

    /**
     * Generic endpoint
     */
    async endpoint(path, params = {}) {

        return this.get(

            path,

            params,

            60

        );

    }

}

export default new MovieBoxService();
