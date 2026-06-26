/**
 * ============================================================
 * Cymor Movie API
 * Configuration Manager
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

import dotenv from "dotenv";

dotenv.config();

/**
 * Environment
 */
const ENV = process.env.NODE_ENV || "development";

/**
 * Server
 */
const SERVER = {

    PORT: Number(process.env.PORT || 3000),

    HOST: process.env.HOST || "0.0.0.0"

};

/**
 * MovieBox API
 */
const API = {

    BASE_URL:
        process.env.API_BASE ||
        "https://mbpapi.sanzo.top",

    HOST_POOL:
        process.env.HOST_POOL
            ?.split(",")
            .map(host => host.trim())
            .filter(Boolean) || [

                "https://mbpapi.sanzo.top",

                "https://mbpapi2.sanzo.top"

            ],

    REQUEST_TIMEOUT:
        Number(
            process.env.REQUEST_TIMEOUT
        ) || 20000

};

/**
 * Authentication
 */
const AUTH = {

    TOKEN:
        process.env.AUTH_TOKEN || "",

    CLIENT_INFO:
        process.env.CLIENT_INFO ||
        "android/17.5.0",

    USER_AGENT:
        process.env.USER_AGENT ||
        "okhttp/4.12.0"

};

/**
 * Security
 */
const SECURITY = {

    JWT_SECRET:

        process.env.JWT_SECRET ||

        "change-this-secret",

    SESSION_SECRET:

        process.env.SESSION_SECRET ||

        "change-this-session"

};

/**
 * Cache
 */
const CACHE = {

    ENABLED:

        process.env.CACHE_ENABLED === "true",

    TTL:

        Number(
            process.env.CACHE_TTL
        ) || 600

};

/**
 * Rate Limiter
 */
const RATE_LIMIT = {

    WINDOW:

        Number(
            process.env.RATE_LIMIT_WINDOW
        ) || 900000,

    MAX:

        Number(
            process.env.RATE_LIMIT_MAX
        ) || 300

};

/**
 * Logging
 */
const LOGGING = {

    LEVEL:

        process.env.LOG_LEVEL ||

        "info"

};

/**
 * Downloads
 */
const DOWNLOAD = {

    TIMEOUT:

        Number(
            process.env.DOWNLOAD_TIMEOUT
        ) || 60000,

    MAX_SIZE:

        Number(
            process.env.MAX_DOWNLOAD_SIZE
        ) ||

        2147483648

};

/**
 * Streaming
 */
const STREAM = {

    TIMEOUT:

        Number(
            process.env.STREAM_TIMEOUT
        ) || 60000

};

/**
 * Redis
 */
const REDIS = {

    ENABLED:

        process.env.REDIS_ENABLED === "true",

    HOST:

        process.env.REDIS_HOST ||

        "127.0.0.1",

    PORT:

        Number(
            process.env.REDIS_PORT
        ) || 6379,

    PASSWORD:

        process.env.REDIS_PASSWORD || ""

};

/**
 * Proxy
 */
const PROXY = {

    HTTP:

        process.env.HTTP_PROXY || "",

    HTTPS:

        process.env.HTTPS_PROXY || ""

};

/**
 * Analytics
 */
const ANALYTICS = {

    ENABLED:

        process.env.ENABLE_ANALYTICS === "true"

};

/**
 * Maintenance Mode
 */
const MAINTENANCE = {

    ENABLED:

        process.env.MAINTENANCE_MODE === "true"

};

/**
 * Export Configuration
 */
const config = {

    ENV,

    SERVER,

    API,

    AUTH,

    SECURITY,

    CACHE,

    RATE_LIMIT,

    LOGGING,

    DOWNLOAD,

    STREAM,

    REDIS,

    PROXY,

    ANALYTICS,

    MAINTENANCE

};

export default config;

export {

    ENV,

    SERVER,

    API,

    AUTH,

    SECURITY,

    CACHE,

    RATE_LIMIT,

    LOGGING,

    DOWNLOAD,

    STREAM,

    REDIS,

    PROXY,

    ANALYTICS,

    MAINTENANCE

};
