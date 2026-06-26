/**
 * ============================================================
 * Cymor Movie API
 * Axios Configuration
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

import axios from "axios";

import config from "./index.js";

import {
    buildHeaders,
    parseUserHeader
} from "../utils/crypto.js";

let runtimeToken = config.AUTH.TOKEN;

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({

    baseURL: config.API.BASE_URL,

    timeout: config.API.REQUEST_TIMEOUT,

    headers: {

        Accept: "application/json",

        "Content-Type": "application/json",

        "User-Agent": config.AUTH.USER_AGENT

    }

});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(

    (request) => {

        const method = request.method?.toUpperCase() || "GET";

        const body = request.data
            ? JSON.stringify(request.data)
            : "";

        const url = new URL(

            request.url,

            request.baseURL

        ).toString();

        request.headers = {

            ...request.headers,

            ...buildHeaders(

                method,

                url,

                body,

                runtimeToken

            )

        };

        request.metadata = {

            started: Date.now()

        };

        return request;

    },

    (error) => Promise.reject(error)

);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(

    (response) => {

        const token = parseUserHeader(

            response.headers["x-user"] ||

            response.headers["X-User"]

        );

        if (token) {

            runtimeToken = token;

        }

        response.duration =

            Date.now() -

            response.config.metadata.started;

        return response;

    },

    (error) => {

        if (error.response) {

            console.error(

                `[${error.response.status}] ${error.config.url}`

            );

        } else {

            console.error(

                "Network Error:",

                error.message

            );

        }

        return Promise.reject(error);

    }

);

/*
|--------------------------------------------------------------------------
| Helper Methods
|--------------------------------------------------------------------------
*/

export async function get(

    url,

    config = {}

) {

    return api.get(url, config);

}

export async function post(

    url,

    data = {},

    config = {}

) {

    return api.post(

        url,

        data,

        config

    );

}

export async function put(

    url,

    data = {},

    config = {}

) {

    return api.put(

        url,

        data,

        config

    );

}

export async function del(

    url,

    config = {}

) {

    return api.delete(

        url,

        config

    );

}

/*
|--------------------------------------------------------------------------
| Runtime Token
|--------------------------------------------------------------------------
*/

export function token() {

    return runtimeToken;

}

export function setToken(value) {

    runtimeToken = value;

}

/*
|--------------------------------------------------------------------------
| Base URL
|--------------------------------------------------------------------------
*/

export function setBaseURL(url) {

    api.defaults.baseURL = url;

}

export function baseURL() {

    return api.defaults.baseURL;

}

/*
|--------------------------------------------------------------------------
| Timeout
|--------------------------------------------------------------------------
*/

export function setTimeoutValue(ms) {

    api.defaults.timeout = ms;

}

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default api;
