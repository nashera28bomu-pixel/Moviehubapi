import axios from 'axios';
import * as cheerio from 'cheerio';
import cache, { buildKey } from '../config/cache.js';
import { CACHE_TTL } from '../config/constants.js';

// ---------------------------------------------------------------------------
// Scraping client — targets h5.aoneroom.com HTML pages
// ---------------------------------------------------------------------------

const BASE = 'https://h5.aoneroom.com';

const scraper = axios.create({
  baseURL: BASE,
  timeout: 20000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    Referer: BASE + '/',
  },
});

// Also keep a JSON client for the API endpoints that do exist
const apiClient = axios.create({
  baseURL: 'https://h5-api.aoneroom.com',
  timeout: 20000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    Referer: BASE + '/',
    Origin: BASE,
  },
});

// ---------------------------------------------------------------------------
// Nuxt data extractor — MovieBox uses Nuxt SSR; data lives in __NUXT_DATA__
// ---------------------------------------------------------------------------

const extractNuxtData = (html) => {
  try {
    // Try script tag with id __NUXT_DATA__
    const $ = cheerio.load(html);
    const scriptContent = $('script#__NUXT_DATA__').html();
    if (scriptContent) {
      return JSON.parse(scriptContent);
    }

    // Fallback: inline window.__NUXT__ assignment
    const match = html.match(/window\.__NUXT__\s*=\s*(\{[\s\S]*?\})(?:\s*;?\s*<\/script>)/);
    if (match) {
      return JSON.parse(match[1]);
    }

    // Fallback: nuxtApp.payload pattern
    const payloadMatch = html.match(/__NUXT_DATA__\s*=\s*(\[[\s\S]*?\])\s*<\/script>/);
    if (payloadMatch) {
      return JSON.parse(payloadMatch[1]);
    }

    return null;
  } catch {
    return null;
  }
};

// Resolve a __NUXT_DATA__ array (flat reference format) into a proper object
const resolveNuxtArray = (data) => {
  if (!Array.isArray(data)) return data;
  const resolve = (idx) => {
    if (idx === null || idx === undefined) return null;
    const item = data[idx];
    if (item === null || item === undefined) return item;
    if (typeof item === 'object' && !Array.isArray(item)) {
      const out = {};
      for (const [k, v] of Object.entries(item)) {
        out[k] = typeof v === 'number' ? resolve(v) : v;
      }
      return out;
    }
    if (Array.isArray(item)) return item.map((v) => (typeof v === 'number' ? resolve(v) : v));
    return item;
  };
  return resolve(0);
};

// ---------------------------------------------------------------------------
// Scrape a page and return both raw HTML and parsed Nuxt data
// ---------------------------------------------------------------------------

const scrapePage = async (path, params = {}) => {
  const qs = new URLSearchParams(params).toString();
  const url = `${path}${qs ? '?' + qs : ''}`;
  const response = await scraper.get(url);
  const html = response.data;
  const nuxt = extractNuxtData(html);
  return { html, nuxt };
};

// ---------------------------------------------------------------------------
// Parse movie cards from cheerio — used as fallback when Nuxt parse fails
// ---------------------------------------------------------------------------

const parseMovieCards = ($) => {
  const items = [];
  $('[class*="movie-item"], [class*="item-card"], [class*="content-item"]').each((_, el) => {
    const $el = $(el);
    const title = $el.find('[class*="title"], h3, h4').first().text().trim();
    const poster = $el.find('img').attr('src') || $el.find('img').attr('data-src') || '';
    const href = $el.find('a').attr('href') || '';
    const rating = $el.find('[class*="score"], [class*="rating"]').first().text().trim();
    if (title || poster) {
      items.push({ title, poster, href, rating });
    }
  });
  return items;
};

// ---------------------------------------------------------------------------
// Direct API approach — try h5-api.aoneroom.com JSON endpoints
// (these may or may not work depending on auth; we fall back to scraping)
// ---------------------------------------------------------------------------

const tryApiCall = async (path, params = {}) => {
  try {
    const response = await apiClient.get(path, { params });
    if (response.data && (response.data.data || response.data.items || response.data.list)) {
      return response.data.data || response.data;
    }
    return null;
  } catch {
    return null;
  }
};

// ---------------------------------------------------------------------------
// Known working API paths (discovered from network analysis of the site)
// ---------------------------------------------------------------------------

const API_PATHS = {
  home: '/web/home',
  search: '/web/search',
  detail: '/web/detail',
  trending: '/web/trend',
  latest: '/web/new',
  popular: '/web/hot',
  rank: '/web/rank',
  category: '/web/category',
  episodes: '/web/episode',
  recommend: '/web/recommend',
};

// ---------------------------------------------------------------------------
// Public service methods
// ---------------------------------------------------------------------------

export const home = async ({ page = 1 } = {}) => {
  const key = buildKey('home', { page });
  return cache.remember(key, CACHE_TTL.HOME, async () => {
    // Try direct API first
    let data = await tryApiCall(API_PATHS.home, { page });
    if (data) return data;

    // Fallback: scrape homepage HTML
    const { html, nuxt } = await scrapePage('/web/home');
    if (nuxt) {
      const resolved = resolveNuxtArray(nuxt);
      return resolved || { raw: true, message: 'Homepage scraped' };
    }

    // Last resort: parse HTML cards
    const $ = cheerio.load(html);
    const banner = [];
    $('[class*="banner"] img, [class*="swiper"] img').each((_, el) => {
      banner.push({ src: $(el).attr('src') || $(el).attr('data-src') });
    });
    const items = parseMovieCards($);
    return { banner, items, page };
  });
};

export const trending = async ({ page = 1, limit = 20, type = '' } = {}) => {
  const key = buildKey('trending', { page, limit, type });
  return cache.remember(key, CACHE_TTL.TRENDING, async () => {
    let data = await tryApiCall(API_PATHS.trending, { page, size: limit, ...(type && { type }) });
    if (data) return data;

    const { html, nuxt } = await scrapePage('/web/searchResult', { q: 'trending', page });
    if (nuxt) return resolveNuxtArray(nuxt) || {};
    const $ = cheerio.load(html);
    return { items: parseMovieCards($), page };
  });
};

export const search = async ({ query, page = 1, limit = 20, type = '' } = {}) => {
  if (!query) throw Object.assign(new Error('Search query is required'), { status: 400 });
  const key = buildKey('search', { query, page, limit, type });
  return cache.remember(key, CACHE_TTL.SEARCH, async () => {
    // Try API
    let data = await tryApiCall(API_PATHS.search, {
      keyword: query,
      page,
      size: limit,
      ...(type && { type }),
    });
    if (data) return data;

    // Scrape search results page
    const { html, nuxt } = await scrapePage('/web/searchResult', { q: query, page });
    if (nuxt) return resolveNuxtArray(nuxt) || {};
    const $ = cheerio.load(html);
    return { query, items: parseMovieCards($), page };
  });
};

export const details = async ({ id, slug = '', type = '' } = {}) => {
  if (!id && !slug) throw Object.assign(new Error('Content ID or slug is required'), { status: 400 });
  const key = buildKey('details', { id, slug, type });
  return cache.remember(key, CACHE_TTL.DETAILS, async () => {
    // Try API with id
    if (id) {
      let data = await tryApiCall(API_PATHS.detail, { id, ...(type && { type }) });
      if (data) return data;
    }

    // Scrape detail page
    const detailPath = slug ? `/web/detail/${slug}` : `/web/detail`;
    const params = id ? { id } : {};
    const { html, nuxt } = await scrapePage(detailPath, params);
    if (nuxt) return resolveNuxtArray(nuxt) || {};
    const $ = cheerio.load(html);
    const title = $('h1, [class*="title"]').first().text().trim();
    const poster = $('img[class*="poster"], img[class*="cover"]').first().attr('src') || '';
    const description = $('[class*="desc"], [class*="synopsis"]').first().text().trim();
    return { id, slug, title, poster, description };
  });
};

export const movie = async ({ id, slug } = {}) => details({ id, slug, type: '1' });
export const series = async ({ id, slug } = {}) => details({ id, slug, type: '2' });
export const anime = async ({ id, slug } = {}) => details({ id, slug, type: '3' });

export const stream = async ({ id, slug = '', episode = '', season = '', quality = '' } = {}) => {
  if (!id && !slug) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('stream', { id, slug, episode, season, quality });
  return cache.remember(key, CACHE_TTL.STREAM, async () => {
    // Try known stream endpoint
    let data = await tryApiCall('/web/stream', {
      id,
      ...(episode && { episode }),
      ...(season && { season }),
      ...(quality && { quality }),
    });
    if (data) return data;

    // Scrape detail page and extract stream URLs
    const detailPath = slug ? `/web/detail/${slug}` : `/web/detail`;
    const { html } = await scrapePage(detailPath, id ? { id } : {});
    const $ = cheerio.load(html);

    const streamUrls = [];
    $('video source, [data-src], [data-url]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-url');
      if (src && (src.includes('.m3u8') || src.includes('.mp4'))) {
        streamUrls.push(src);
      }
    });

    // Extract from inline scripts
    const scriptMatches = html.match(/["'](https?:\/\/[^"']*\.(?:m3u8|mp4)[^"']*)/g) || [];
    scriptMatches.forEach((m) => streamUrls.push(m.replace(/^["']/, '')));

    return {
      id,
      slug,
      streams: [...new Set(streamUrls)],
      episode,
      season,
    };
  });
};

export const downloads = async ({ id, slug = '', episode = '', season = '', quality = '' } = {}) => {
  if (!id && !slug) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('downloads', { id, slug, episode, season, quality });
  return cache.remember(key, CACHE_TTL.DOWNLOADS, async () => {
    let data = await tryApiCall('/web/download', {
      id,
      ...(episode && { episode }),
      ...(season && { season }),
      ...(quality && { quality }),
    });
    if (data) return data;

    // Fall back to stream endpoint — same source
    return stream({ id, slug, episode, season, quality });
  });
};

const categoryPage = async (key, pagePath, apiPath, apiParams, { page, limit }) => {
  return cache.remember(key, CACHE_TTL.CATEGORY, async () => {
    let data = await tryApiCall(apiPath, { ...apiParams, page, size: limit });
    if (data) return data;

    const { html, nuxt } = await scrapePage(pagePath, { page });
    if (nuxt) return resolveNuxtArray(nuxt) || {};
    const $ = cheerio.load(html);
    return { items: parseMovieCards($), page };
  });
};

export const latestMovies = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('latest_movies', { page, limit }), '/web/movie', API_PATHS.latest, { type: 1 }, { page, limit });

export const latestSeries = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('latest_series', { page, limit }), '/web/tv', API_PATHS.latest, { type: 2 }, { page, limit });

export const latestAnime = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('latest_anime', { page, limit }), '/web/animation', API_PATHS.latest, { type: 3 }, { page, limit });

export const hollywood = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('hollywood', { page, limit }), '/web/movie', API_PATHS.category, { area: 'US' }, { page, limit });

export const nollywood = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('nollywood', { page, limit }), '/web/movie', API_PATHS.category, { area: 'NG' }, { page, limit });

export const kdrama = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('kdrama', { page, limit }), '/web/tv', API_PATHS.category, { area: 'KR', type: 2 }, { page, limit });

export const chineseDrama = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('chinese_drama', { page, limit }), '/web/tv', API_PATHS.category, { area: 'CN', type: 2 }, { page, limit });

export const japaneseDrama = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('japanese_drama', { page, limit }), '/web/tv', API_PATHS.category, { area: 'JP', type: 2 }, { page, limit });

export const indianMovies = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('indian_movies', { page, limit }), '/web/movie', API_PATHS.category, { area: 'IN' }, { page, limit });

export const byCategory = async ({ category, page = 1, limit = 20, type = '' } = {}) => {
  if (!category) throw Object.assign(new Error('Category is required'), { status: 400 });
  const key = buildKey('category', { category, page, limit, type });
  return cache.remember(key, CACHE_TTL.CATEGORY, async () => {
    let data = await tryApiCall(API_PATHS.category, { genre: category, page, size: limit, ...(type && { type }) });
    if (data) return data;
    const { html, nuxt } = await scrapePage('/web/searchResult', { genre: category, page });
    if (nuxt) return resolveNuxtArray(nuxt) || {};
    const $ = cheerio.load(html);
    return { category, items: parseMovieCards($), page };
  });
};

export const action = (o) => byCategory({ ...o, category: 'action' });
export const adventure = (o) => byCategory({ ...o, category: 'adventure' });
export const comedy = (o) => byCategory({ ...o, category: 'comedy' });
export const drama = (o) => byCategory({ ...o, category: 'drama' });
export const fantasy = (o) => byCategory({ ...o, category: 'fantasy' });
export const family = (o) => byCategory({ ...o, category: 'family' });
export const animation = (o) => byCategory({ ...o, category: 'animation' });
export const documentary = (o) => byCategory({ ...o, category: 'documentary' });
export const mystery = (o) => byCategory({ ...o, category: 'mystery' });
export const thriller = (o) => byCategory({ ...o, category: 'thriller' });
export const crime = (o) => byCategory({ ...o, category: 'crime' });
export const scifi = (o) => byCategory({ ...o, category: 'sci-fi' });
export const horror = (o) => byCategory({ ...o, category: 'horror' });
export const romance = (o) => byCategory({ ...o, category: 'romance' });
export const war = (o) => byCategory({ ...o, category: 'war' });
export const history = (o) => byCategory({ ...o, category: 'history' });
export const music = (o) => byCategory({ ...o, category: 'music' });
export const western = (o) => byCategory({ ...o, category: 'western' });

export const topRated = ({ page = 1, limit = 20, type = '' } = {}) => {
  const key = buildKey('top_rated', { page, limit, type });
  return cache.remember(key, CACHE_TTL.CATEGORY, async () => {
    let data = await tryApiCall(API_PATHS.rank, { sort: 'score', page, size: limit, ...(type && { type }) });
    if (data) return data;
    const { html, nuxt } = await scrapePage('/web/rank', { page });
    if (nuxt) return resolveNuxtArray(nuxt) || {};
    const $ = cheerio.load(html);
    return { items: parseMovieCards($), page };
  });
};

export const popular = ({ page = 1, limit = 20, type = '' } = {}) => {
  const key = buildKey('popular', { page, limit, type });
  return cache.remember(key, CACHE_TTL.CATEGORY, async () => {
    let data = await tryApiCall(API_PATHS.popular, { page, size: limit, ...(type && { type }) });
    if (data) return data;
    const { html, nuxt } = await scrapePage('/web/movie', { sort: 'hot', page });
    if (nuxt) return resolveNuxtArray(nuxt) || {};
    const $ = cheerio.load(html);
    return { items: parseMovieCards($), page };
  });
};

export const recommended = ({ id = '', page = 1, limit = 20 } = {}) => {
  const key = buildKey('recommended', { id, page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, async () => {
    let data = await tryApiCall(API_PATHS.recommend, { id, page, size: limit });
    if (data) return data;
    return { items: [], message: 'Recommendations require a valid content ID' };
  });
};

export const subtitles = async ({ id, episode = '', season = '', language = 'en' } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('subtitles', { id, episode, season, language });
  return cache.remember(key, CACHE_TTL.SUBTITLES, async () => {
    let data = await tryApiCall('/web/subtitle', { id, language, ...(episode && { episode }), ...(season && { season }) });
    return data || { id, language, subtitles: [] };
  });
};

export const cast = async ({ id } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('cast', { id });
  return cache.remember(key, CACHE_TTL.CAST, async () => {
    let data = await tryApiCall('/web/cast', { id });
    return data || { id, cast: [] };
  });
};

export const trailers = async ({ id } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('trailers', { id });
  return cache.remember(key, CACHE_TTL.TRAILERS, async () => {
    let data = await tryApiCall('/web/trailer', { id });
    return data || { id, trailers: [] };
  });
};

export const recommendations = async ({ id, page = 1, limit = 20 } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('recommendations', { id, page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, async () => {
    let data = await tryApiCall('/web/similar', { id, page, size: limit });
    return data || { id, items: [] };
  });
};

export const episodes = async ({ id, season = 1 } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('episodes', { id, season });
  return cache.remember(key, CACHE_TTL.EPISODES, async () => {
    let data = await tryApiCall(API_PATHS.episodes, { id, season });
    return data || { id, season, episodes: [] };
  });
};

export const seasons = async ({ id } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('seasons', { id });
  return cache.remember(key, CACHE_TTL.EPISODES, async () => {
    let data = await tryApiCall('/web/seasons', { id });
    return data || { id, seasons: [] };
  });
};

export const animeCategory = ({ page = 1, limit = 20 } = {}) =>
  categoryPage(buildKey('anime_category', { page, limit }), '/web/animation', API_PATHS.latest, { type: 3 }, { page, limit });

export const continueWatching = async () => ({
  items: [],
  message: 'User authentication required for this feature',
});

export const favorites = async () => ({
  items: [],
  message: 'User authentication required for this feature',
});

export const endpoint = async ({ path, params = {} } = {}) => {
  if (!path) throw Object.assign(new Error('Endpoint path is required'), { status: 400 });
  const key = buildKey('endpoint', { path, ...params });
  return cache.remember(key, CACHE_TTL.SEARCH, async () => {
    let data = await tryApiCall(path, params);
    if (data) return data;
    const { html, nuxt } = await scrapePage(path, params);
    if (nuxt) return resolveNuxtArray(nuxt) || {};
    const $ = cheerio.load(html);
    return { items: parseMovieCards($) };
  });
};
