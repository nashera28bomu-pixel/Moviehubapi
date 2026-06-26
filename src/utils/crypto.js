/**
 * ===========================================================
 * Cymor Movie API
 * Request Signing Utility
 * ===========================================================
 */

import crypto from "crypto";
import {
    CLIENT_INFO,
    AUTH_TOKEN,
    USER_AGENT
} from "../config/constants.js";

/**
 * Current unix timestamp
 */
export function timestamp() {
    return Math.floor(Date.now() / 1000).toString();
}

/**
 * Random nonce
 */
export function nonce(length = 16) {

    const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let out = "";

    for (let i = 0; i < length; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }

    return out;
}

/**
 * SHA256 Hash
 */
export function sha256(text) {

    return crypto
        .createHash("sha256")
        .update(text)
        .digest("hex");
}

/**
 * HMAC SHA256
 */
export function hmac(text, key) {

    return crypto
        .createHmac("sha256", key)
        .update(text)
        .digest("hex");
}

/**
 * MD5
 */
export function md5(text) {

    return crypto
        .createHash("md5")
        .update(text)
        .digest("hex");
}

/**
 * Generate request signature.
 *
 * Compatible with MovieBox v3.
 */
export function createSignature(
    method,
    url,
    body = ""
) {

    const ts = timestamp();
    const random = nonce(24);

    const payload = [
        method.toUpperCase(),
        url,
        body,
        ts,
        random
    ].join("\n");

    const signature = hmac(
        payload,
        AUTH_TOKEN
    );

    return {
        signature,
        ts,
        random
    };
}

/**
 * Build headers
 */
export function buildHeaders(
    method,
    url,
    body = ""
) {

    const sign = createSignature(
        method,
        url,
        body
    );

    return {

        Accept: "application/json",

        "Content-Type": "application/json",

        "User-Agent": USER_AGENT,

        "X-Client-Info": CLIENT_INFO,

        "X-Client-Token": AUTH_TOKEN,

        "x-tr-signature": sign.signature,

        "x-tr-timestamp": sign.ts,

        "x-tr-nonce": sign.random
    };
}

/**
 * Parse token returned by MovieBox.
 */
export function parseUserHeader(header) {

    if (!header) return null;

    try {

        const data = JSON.parse(header);

        return data.token || null;

    } catch {

        return null;

    }

}

/**
 * Random Device ID
 */
export function deviceId() {

    return crypto.randomUUID();

}

/**
 * Generate Session ID
 */
export function sessionId() {

    return crypto.randomBytes(16).toString("hex");

}

/**
 * Random Android ID
 */
export function androidId() {

    return crypto.randomBytes(8).toString("hex");

}

/**
 * UUID
 */
export function uuid() {

    return crypto.randomUUID();

}
