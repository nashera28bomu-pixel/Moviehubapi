/**
 * ============================================================
 * Cymor Movie API
 * Memory Cache
 *
 * Creator: Legendary Smiley Cymor
 * ============================================================
 */

import { LRUCache } from "lru-cache";

import config from "./index.js";

/*
|--------------------------------------------------------------------------
| Cache Instance
|--------------------------------------------------------------------------
*/

const cache = new LRUCache({

    max: 1000,

    ttl: config.CACHE.TTL * 1000,

    updateAgeOnGet: true,

    allowStale: false

});

/*
|--------------------------------------------------------------------------
| Cache Helpers
|--------------------------------------------------------------------------
*/

export function has(key) {

    return cache.has(key);

}

export function get(key) {

    return cache.get(key);

}

export function set(key, value, ttl) {

    cache.set(key, value, {

        ttl: (ttl || config.CACHE.TTL) * 1000

    });

    return value;

}

export function remove(key) {

    cache.delete(key);

}

export function clear() {

    cache.clear();

}

export function keys() {

    return [...cache.keys()];

}

export function values() {

    return [...cache.values()];

}

export function size() {

    return cache.size;

}

/*
|--------------------------------------------------------------------------
| Cache Wrapper
|--------------------------------------------------------------------------
*/

export async function remember(

    key,

    callback,

    ttl

) {

    if (!config.CACHE.ENABLED) {

        return await callback();

    }

    const cached = cache.get(key);

    if (cached !== undefined) {

        return cached;

    }

    const value = await callback();

    cache.set(

        key,

        value,

        {

            ttl: (ttl || config.CACHE.TTL) * 1000

        }

    );

    return value;

}

/*
|--------------------------------------------------------------------------
| Cache Statistics
|--------------------------------------------------------------------------
*/

export function stats() {

    return {

        enabled: config.CACHE.ENABLED,

        entries: cache.size,

        max: cache.max,

        ttl: config.CACHE.TTL

    };

}

/*
|--------------------------------------------------------------------------
| Cache Keys
|--------------------------------------------------------------------------
*/

export function key(...parts) {

    return parts

        .filter(Boolean)

        .join(":");

}

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {

    has,

    get,

    set,

    remove,

    clear,

    keys,

    values,

    size,

    remember,

    stats,

    key

};
