/**
 * ============================================================
 * Cymor Movie API
 * HTTP Request Manager
 *
 * - Automatic host fallback
 * - Automatic request signing
 * - Token refresh
 * - Error handling
 * - JSON parsing
 * ============================================================
 */

import axios from "axios";

import {
    buildHeaders,
    parseUserHeader
} from "./crypto.js";

import {
    HOST_POOL,
    DEFAULT_API_BASE
} from "../config/constants.js";

let runtimeToken = null;

let activeHost = DEFAULT_API_BASE;

/**
 * Current active host
 */
export function currentHost() {
    return activeHost;
}

/**
 * Current auth token
 */
export function currentToken() {
    return runtimeToken;
}

/**
 * Save latest token from MovieBox
 */
function absorbToken(response) {

    const header =
        response.headers["x-user"] ||
        response.headers["X-User"];

    const token = parseUserHeader(header);

    if (token) {
        runtimeToken = token;
    }

}

/**
 * Build complete URL
 */
function buildURL(base, path, params = {}) {

    const url = new URL(path, base);

    Object.entries(params).forEach(([key, value]) => {

        if (
            value !== undefined &&
            value !== null
        ) {
            url.searchParams.append(key, value);
        }

    });

    return url.toString();

}

/**
 * Internal request handler
 */
async function execute({

    method = "GET",

    path,

    params = {},

    body = null,

    headers = {}

}) {

    let lastError;

    for (const host of HOST_POOL) {

        try {

            const url = buildURL(
                host,
                path,
                params
            );

            const signedHeaders =
                buildHeaders(
                    method,
                    url,
                    body
                        ? JSON.stringify(body)
                        : ""
                );

            const response =
                await axios({

                    method,

                    url,

                    headers: {
                        ...signedHeaders,
                        ...headers
                    },

                    data: body,

                    timeout: 20000,

                    validateStatus: () => true

                });

            absorbToken(response);

            if (
                response.status >= 500
            ) {

                continue;

            }

            activeHost = host;

            return response;

        } catch (err) {

            lastError = err;

        }

    }

    throw lastError ??
        new Error(
            "All MovieBox hosts failed."
        );

}

/**
 * GET request
 */
export async function get(
    path,
    params = {},
    headers = {}
) {

    return execute({

        method: "GET",

        path,

        params,

        headers

    });

}

/**
 * POST request
 */
export async function post(
    path,
    body = {},
    params = {},
    headers = {}
) {

    return execute({

        method: "POST",

        path,

        params,

        body,

        headers

    });

}

/**
 * Extract API data
 */
export async function getData(
    path,
    params = {}
) {

    const response =
        await get(path, params);

    if (
        response.data &&
        response.data.data
    ) {
        return response.data.data;
    }

    throw new Error(

        response.data?.message ||

        "MovieBox returned an invalid response."

    );

}

/**
 * POST and return data
 */
export async function postData(
    path,
    body = {},
    params = {}
) {

    const response =
        await post(
            path,
            body,
            params
        );

    if (
        response.data &&
        response.data.data
    ) {

        return response.data.data;

    }

    throw new Error(

        response.data?.message ||

        "MovieBox returned an invalid response."

    );

}

/**
 * Download remote file
 */
export async function downloadFile(
    url,
    headers = {}
) {

    return axios({

        url,

        method: "GET",

        responseType: "stream",

        headers,

        timeout: 30000

    });

}

/**
 * Fetch arbitrary URL
 */
export async function raw(
    url,
    headers = {}
) {

    return axios({

        url,

        method: "GET",

        headers,

        timeout: 20000

    });

}

export default {

    get,

    post,

    getData,

    postData,

    raw,

    downloadFile,

    currentHost,

    currentToken

};
