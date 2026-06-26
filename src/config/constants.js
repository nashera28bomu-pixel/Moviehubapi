/**
 * ============================================================
 * Cymor Movie API
 * Application Constants
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

/*
|--------------------------------------------------------------------------
| Application
|--------------------------------------------------------------------------
*/

export const APP = {

    NAME: "Cymor Movie API",

    VERSION: "1.0.0",

    AUTHOR: "Legendary Smiley Cymor"

};

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

export const API = {

    PREFIX: "/api",

    HEALTH: "/health"

};

/*
|--------------------------------------------------------------------------
| Movie Categories
|--------------------------------------------------------------------------
*/

export const CATEGORIES = {

    HOME: "home",

    TRENDING: "trending",

    HOLLYWOOD: "Hollywood",

    NOLLYWOOD: "Nollywood",

    ANIME: "Anime",

    KDRAMA: "Korean Drama",

    ACTION: "Action",

    ADVENTURE: "Adventure",

    COMEDY: "Comedy",

    CRIME: "Crime",

    DOCUMENTARY: "Documentary",

    DRAMA: "Drama",

    FAMILY: "Family",

    FANTASY: "Fantasy",

    HISTORY: "History",

    HORROR: "Horror",

    MUSIC: "Music",

    MYSTERY: "Mystery",

    ROMANCE: "Romance",

    SCI_FI: "Science Fiction",

    THRILLER: "Thriller",

    WAR: "War",

    WESTERN: "Western"

};

/*
|--------------------------------------------------------------------------
| Subject Types
|--------------------------------------------------------------------------
*/

export const SUBJECT_TYPES = {

    MOVIE: "MOVIES",

    SERIES: "TV_SERIES",

    ANIME: "ANIME"

};

/*
|--------------------------------------------------------------------------
| Languages
|--------------------------------------------------------------------------
*/

export const LANGUAGES = {

    ENGLISH: "en",

    JAPANESE: "ja",

    KOREAN: "ko",

    CHINESE: "zh",

    HINDI: "hi"

};

/*
|--------------------------------------------------------------------------
| Image Sizes
|--------------------------------------------------------------------------
*/

export const IMAGE = {

    SMALL: "w200",

    MEDIUM: "w500",

    LARGE: "original"

};

/*
|--------------------------------------------------------------------------
| Cache Keys
|--------------------------------------------------------------------------
*/

export const CACHE_KEYS = {

    HOME: "homepage",

    TRENDING: "trending",

    SEARCH: "search",

    DETAILS: "details",

    STREAM: "stream",

    DOWNLOAD: "download"

};

/*
|--------------------------------------------------------------------------
| HTTP Status Codes
|--------------------------------------------------------------------------
*/

export const HTTP = {

    OK: 200,

    CREATED: 201,

    BAD_REQUEST: 400,

    UNAUTHORIZED: 401,

    FORBIDDEN: 403,

    NOT_FOUND: 404,

    TOO_MANY_REQUESTS: 429,

    INTERNAL_SERVER_ERROR: 500

};

/*
|--------------------------------------------------------------------------
| Default Pagination
|--------------------------------------------------------------------------
*/

export const PAGINATION = {

    PAGE: 1,

    PER_PAGE: 20,

    MAX_PER_PAGE: 100

};

/*
|--------------------------------------------------------------------------
| Export Default
|--------------------------------------------------------------------------
*/

export default {

    APP,

    API,

    CATEGORIES,

    SUBJECT_TYPES,

    LANGUAGES,

    IMAGE,

    CACHE_KEYS,

    HTTP,

    PAGINATION

};
