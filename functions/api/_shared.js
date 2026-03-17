/**
 * WorkDesk — Shared utilities for Cloudflare Pages Functions
 *
 * Import in each API handler:
 *   import { CORS, json, getToken } from './_shared.js';
 *
 * Files prefixed with `_` are not mapped to routes by Cloudflare Pages.
 */

/** CORS headers for public API endpoints. */
export const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type':                 'application/json',
};

/**
 * Return a JSON response with CORS headers.
 * @param {unknown} data
 * @param {number}  [status=200]
 */
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

/**
 * Extract the Bearer token from the Authorization header.
 * Returns an empty string when no token is present.
 * @param {Request} request
 * @returns {string}
 */
export function getToken(request) {
  return (request.headers.get('Authorization') || '').replace('Bearer ', '').trim();
}
