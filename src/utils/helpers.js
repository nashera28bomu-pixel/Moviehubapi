/**
 * ===========================================================
 * Cymor Movie API
 * Helper Utilities
 * ===========================================================
 */

import { URL } from "url";

/**
 * Build query string.
 */
export function buildQuery(params = {}) {

    const search = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            search.append(key, value);
        }

    });

    return search.toString();

}

/**
 * Append query parameters to path.
 */
export function appendQuery(path, params = {}) {

    const query = buildQuery(params);

    if (!query) return path;

    return `${path}?${query}`;

}

/**
 * Extract API payload.
 */
export function extractData(response) {

    if (!response)
        throw new Error("Empty response.");

    const body = response.data || response;

    if (body.code && body.code !== 0) {

        throw new Error(
            body.message ||
            "MovieBox API Error"
        );

    }

    return body.data ?? body;

}

/**
 * Check success.
 */
export function success(response) {

    return (
        response &&
        (response.code === 0 ||
            response.success === true)
    );

}

/**
 * Convert seconds into HH:MM:SS
 */
export function formatDuration(seconds = 0) {

    seconds = Number(seconds);

    const h = Math.floor(seconds / 3600);

    const m = Math.floor(
        (seconds % 3600) / 60
    );

    const s = seconds % 60;

    return [
        h,
        m,
        s
    ]
        .map(v => String(v).padStart(2, "0"))
        .join(":");

}

/**
 * Convert bytes into readable format.
 */
export function formatBytes(bytes = 0) {

    if (!bytes) return "0 B";

    const units = [
        "B",
        "KB",
        "MB",
        "GB",
        "TB"
    ];

    let index = 0;

    while (
        bytes >= 1024 &&
        index < units.length - 1
    ) {

        bytes /= 1024;

        index++;

    }

    return `${bytes.toFixed(2)} ${units[index]}`;

}

/**
 * Normalize image URL.
 */
export function image(url) {

    if (!url) return null;

    if (
        typeof url === "object" &&
        url.url
    ) {
        return url.url;
    }

    return String(url);

}

/**
 * Normalize play URL.
 */
export function play(url) {

    if (!url) return null;

    if (
        typeof url === "object" &&
        url.url
    ) {

        return url.url;

    }

    return String(url);

}

/**
 * Sort download qualities.
 */
export function sortQualities(files = []) {

    const order = {
        "240P": 1,
        "360P": 2,
        "480P": 3,
        "720P": 4,
        "1080P": 5,
        "2K": 6,
        "4K": 7
    };

    return [...files].sort((a, b) => {

        return (
            (order[a.resolution] || 0) -
            (order[b.resolution] || 0)
        );

    });

}

/**
 * Highest quality.
 */
export function bestQuality(files = []) {

    const sorted = sortQualities(files);

    return sorted.at(-1) || null;

}

/**
 * Lowest quality.
 */
export function worstQuality(files = []) {

    const sorted = sortQualities(files);

    return sorted[0] || null;

}

/**
 * Remove duplicates.
 */
export function unique(items = [], key = "id") {

    const seen = new Set();

    return items.filter(item => {

        const value = item[key];

        if (seen.has(value)) {

            return false;

        }

        seen.add(value);

        return true;

    });

}

/**
 * Paginate array.
 */
export function paginate(
    items = [],
    page = 1,
    perPage = 20
) {

    page = Number(page);

    perPage = Number(perPage);

    const start =
        (page - 1) * perPage;

    return {

        page,

        perPage,

        total: items.length,

        totalPages: Math.ceil(
            items.length / perPage
        ),

        hasMore:
            start + perPage < items.length,

        items: items.slice(
            start,
            start + perPage
        )

    };

}

/**
 * Sleep utility.
 */
export function sleep(ms = 1000) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

/**
 * Safe integer.
 */
export function toInt(value, fallback = 0) {

    const number = Number(value);

    return Number.isNaN(number)
        ? fallback
        : number;

}

/**
 * Deep clone object.
 */
export function clone(value) {

    return structuredClone(value);

}

/**
 * Remove null values.
 */
export function clean(obj = {}) {

    return Object.fromEntries(

        Object.entries(obj).filter(

            ([, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ""

        )

    );

}

/**
 * Current unix timestamp.
 */
export function unix() {

    return Math.floor(Date.now() / 1000);

}

/**
 * Current ISO timestamp.
 */
export function now() {

    return new Date().toISOString();

}

/**
 * Random item.
 */
export function random(items = []) {

    if (!items.length)
        return null;

    return items[
        Math.floor(
            Math.random() * items.length
        )
    ];

}

/**
 * Shuffle array.
 */
export function shuffle(items = []) {

    const array = [...items];

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [array[i], array[j]] = [
            array[j],
            array[i]
        ];

    }

    return array;

      }
