import client from '../config/axios.js';
import cache, { buildKey } from '../config/cache.js';
import { unwrapResponse } from '../utils/request.js';
import { CACHE_TTL, CONTENT_TYPE, REGION, CATEGORY_IDS } from '../config/constants.js';

// ---------------------------------------------------------------------------
// Internal request helper
// ---------------------------------------------------------------------------

const get = async (path, params = {}) => {
  const response = await client.get(path, { params });
  return unwrapResponse(response);
};

// ---------------------------------------------------------------------------
// Endpoint path builder
// ---------------------------------------------------------------------------

const buildPath = (segment) => `/moviebox/pc${segment}`;

// ---------------------------------------------------------------------------
// Public service methods
// ---------------------------------------------------------------------------

/**
 * Homepage content — trending, banners, categories preview.
 */
export const home = async ({ page = 1 } = {}) => {
  const key = buildKey('home', { page });
  return cache.remember(key, CACHE_TTL.HOME, () =>
    get(buildPath('/index'), { page }),
  );
};

/**
 * Trending content.
 */
export const trending = async ({ page = 1, limit = 20, type = '' } = {}) => {
  const key = buildKey('trending', { page, limit, type });
  return cache.remember(key, CACHE_TTL.TRENDING, () =>
    get(buildPath('/trend'), { page, size: limit, ...(type && { type }) }),
  );
};

/**
 * Search for movies, series, or anime.
 */
export const search = async ({ query, page = 1, limit = 20, type = '' } = {}) => {
  if (!query) throw Object.assign(new Error('Search query is required'), { status: 400 });
  const key = buildKey('search', { query, page, limit, type });
  return cache.remember(key, CACHE_TTL.SEARCH, () =>
    get(buildPath('/search'), {
      keyword: query,
      page,
      size: limit,
      ...(type && { type }),
    }),
  );
};

/**
 * Details for any content item by ID.
 */
export const details = async ({ id, type = CONTENT_TYPE.MOVIE } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('details', { id, type });
  return cache.remember(key, CACHE_TTL.DETAILS, () =>
    get(buildPath('/detail'), { id, type }),
  );
};

/**
 * Movie-specific details.
 */
export const movie = async ({ id } = {}) => {
  return details({ id, type: CONTENT_TYPE.MOVIE });
};

/**
 * Series-specific details.
 */
export const series = async ({ id } = {}) => {
  return details({ id, type: CONTENT_TYPE.SERIES });
};

/**
 * Anime-specific details.
 */
export const anime = async ({ id } = {}) => {
  return details({ id, type: CONTENT_TYPE.ANIME });
};

/**
 * Stream URL(s) for a content item.
 */
export const stream = async ({ id, episode = '', season = '', quality = '' } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('stream', { id, episode, season, quality });
  return cache.remember(key, CACHE_TTL.STREAM, () =>
    get(buildPath('/stream'), {
      id,
      ...(episode && { episode }),
      ...(season && { season }),
      ...(quality && { quality }),
    }),
  );
};

/**
 * Download links for a content item.
 */
export const downloads = async ({ id, episode = '', season = '', quality = '' } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('downloads', { id, episode, season, quality });
  return cache.remember(key, CACHE_TTL.DOWNLOADS, () =>
    get(buildPath('/download'), {
      id,
      ...(episode && { episode }),
      ...(season && { season }),
      ...(quality && { quality }),
    }),
  );
};

/**
 * Latest movies.
 */
export const latestMovies = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('latest_movies', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/latest'), { page, size: limit, type: CONTENT_TYPE.MOVIE }),
  );
};

/**
 * Latest series.
 */
export const latestSeries = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('latest_series', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/latest'), { page, size: limit, type: CONTENT_TYPE.SERIES }),
  );
};

/**
 * Latest anime.
 */
export const latestAnime = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('latest_anime', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/latest'), { page, size: limit, type: CONTENT_TYPE.ANIME }),
  );
};

/**
 * Hollywood movies.
 */
export const hollywood = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('hollywood', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/region'), { page, size: limit, region: REGION.HOLLYWOOD }),
  );
};

/**
 * Nollywood movies.
 */
export const nollywood = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('nollywood', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/region'), { page, size: limit, region: REGION.NOLLYWOOD }),
  );
};

/**
 * K-Drama content.
 */
export const kdrama = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('kdrama', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/region'), { page, size: limit, region: REGION.KDRAMA }),
  );
};

/**
 * Chinese drama.
 */
export const chineseDrama = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('chinese_drama', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/region'), { page, size: limit, region: REGION.CHINESE }),
  );
};

/**
 * Japanese drama.
 */
export const japaneseDrama = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('japanese_drama', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/region'), { page, size: limit, region: REGION.JAPANESE }),
  );
};

/**
 * Indian movies.
 */
export const indianMovies = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('indian_movies', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/region'), { page, size: limit, region: REGION.INDIAN }),
  );
};

/**
 * Generic category fetch.
 */
export const byCategory = async ({ category, page = 1, limit = 20, type = '' } = {}) => {
  if (!category) throw Object.assign(new Error('Category is required'), { status: 400 });
  const key = buildKey('category', { category, page, limit, type });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/genre'), {
      genre: category,
      page,
      size: limit,
      ...(type && { type }),
    }),
  );
};

export const action = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.ACTION, page, limit, type });

export const adventure = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.ADVENTURE, page, limit, type });

export const comedy = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.COMEDY, page, limit, type });

export const drama = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.DRAMA, page, limit, type });

export const fantasy = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.FANTASY, page, limit, type });

export const family = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.FAMILY, page, limit, type });

export const animation = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.ANIMATION, page, limit, type });

export const documentary = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.DOCUMENTARY, page, limit, type });

export const mystery = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.MYSTERY, page, limit, type });

export const thriller = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.THRILLER, page, limit, type });

export const crime = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.CRIME, page, limit, type });

export const scifi = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.SCI_FI, page, limit, type });

export const horror = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.HORROR, page, limit, type });

export const romance = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.ROMANCE, page, limit, type });

export const war = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.WAR, page, limit, type });

export const history = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.HISTORY, page, limit, type });

export const music = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.MUSIC, page, limit, type });

export const western = ({ page, limit, type } = {}) =>
  byCategory({ category: CATEGORY_IDS.WESTERN, page, limit, type });

/**
 * Top rated content.
 */
export const topRated = async ({ page = 1, limit = 20, type = '' } = {}) => {
  const key = buildKey('top_rated', { page, limit, type });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/top'), { page, size: limit, sort: 'score', ...(type && { type }) }),
  );
};

/**
 * Popular content.
 */
export const popular = async ({ page = 1, limit = 20, type = '' } = {}) => {
  const key = buildKey('popular', { page, limit, type });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/popular'), { page, size: limit, ...(type && { type }) }),
  );
};

/**
 * Recommended content (generic, not user-specific).
 */
export const recommended = async ({ id = '', page = 1, limit = 20 } = {}) => {
  const key = buildKey('recommended', { id, page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/recommend'), { page, size: limit, ...(id && { id }) }),
  );
};

/**
 * Subtitles for a content item.
 */
export const subtitles = async ({ id, episode = '', season = '', language = 'en' } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('subtitles', { id, episode, season, language });
  return cache.remember(key, CACHE_TTL.SUBTITLES, () =>
    get(buildPath('/subtitle'), {
      id,
      language,
      ...(episode && { episode }),
      ...(season && { season }),
    }),
  );
};

/**
 * Cast / credits for a content item.
 */
export const cast = async ({ id } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('cast', { id });
  return cache.remember(key, CACHE_TTL.CAST, () =>
    get(buildPath('/cast'), { id }),
  );
};

/**
 * Trailers for a content item.
 */
export const trailers = async ({ id } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('trailers', { id });
  return cache.remember(key, CACHE_TTL.TRAILERS, () =>
    get(buildPath('/trailer'), { id }),
  );
};

/**
 * Similar / related content recommendations.
 */
export const recommendations = async ({ id, page = 1, limit = 20 } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('recommendations', { id, page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/similar'), { id, page, size: limit }),
  );
};

/**
 * Episodes for a series season.
 */
export const episodes = async ({ id, season = 1 } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('episodes', { id, season });
  return cache.remember(key, CACHE_TTL.EPISODES, () =>
    get(buildPath('/episodes'), { id, season }),
  );
};

/**
 * Season list for a series.
 */
export const seasons = async ({ id } = {}) => {
  if (!id) throw Object.assign(new Error('Content ID is required'), { status: 400 });
  const key = buildKey('seasons', { id });
  return cache.remember(key, CACHE_TTL.EPISODES, () =>
    get(buildPath('/seasons'), { id }),
  );
};

/**
 * Anime category listing.
 */
export const animeCategory = async ({ page = 1, limit = 20 } = {}) => {
  const key = buildKey('anime_category', { page, limit });
  return cache.remember(key, CACHE_TTL.CATEGORY, () =>
    get(buildPath('/latest'), { page, size: limit, type: CONTENT_TYPE.ANIME }),
  );
};

/**
 * Continue watching — future-ready placeholder returning empty list.
 * This will require user auth; exposing the contract now.
 */
export const continueWatching = async ({ userId = '' } = {}) => {
  return { items: [], message: 'User authentication required for this feature' };
};

/**
 * Favorites — future-ready placeholder returning empty list.
 */
export const favorites = async ({ userId = '' } = {}) => {
  return { items: [], message: 'User authentication required for this feature' };
};

/**
 * Proxy call to any arbitrary MovieBox endpoint (power-user escape hatch).
 */
export const endpoint = async ({ path, params = {} } = {}) => {
  if (!path) throw Object.assign(new Error('Endpoint path is required'), { status: 400 });
  const key = buildKey('endpoint', { path, ...params });
  return cache.remember(key, CACHE_TTL.SEARCH, () =>
    get(buildPath(path), params),
  );
};
