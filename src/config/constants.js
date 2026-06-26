// Static constants — no env vars here

export const MOVIEBOX_BASE_URL = 'https://h5-api.aoneroom.com';
export const MOVIEBOX_HOST_V1 = 'h5.aoneroom.com';
export const MOVIEBOX_HOST_V2 = 'h5-api.aoneroom.com';

export const API_PREFIX = '/api/v1';

export const CACHE_TTL = {
  HOME: 10 * 60,         // 10 minutes
  TRENDING: 10 * 60,
  SEARCH: 5 * 60,
  DETAILS: 30 * 60,
  STREAM: 2 * 60,
  DOWNLOADS: 5 * 60,
  CATEGORY: 15 * 60,
  EPISODES: 10 * 60,
  SUBTITLES: 30 * 60,
  CAST: 30 * 60,
  TRAILERS: 30 * 60,
};

export const CACHE_MAX_ITEMS = 500;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
    const status = error?.response?.status;
    return !status || status >= 500 || status === 429;
  },
};

export const REQUEST_TIMEOUT = 15000; // 15 seconds

// MovieBox category IDs (inferred from API patterns)
export const CATEGORY_IDS = {
  ACTION: 'action',
  ADVENTURE: 'adventure',
  COMEDY: 'comedy',
  DRAMA: 'drama',
  FANTASY: 'fantasy',
  FAMILY: 'family',
  ANIMATION: 'animation',
  DOCUMENTARY: 'documentary',
  MYSTERY: 'mystery',
  THRILLER: 'thriller',
  CRIME: 'crime',
  SCI_FI: 'sci-fi',
  HORROR: 'horror',
  ROMANCE: 'romance',
  WAR: 'war',
  HISTORY: 'history',
  MUSIC: 'music',
  WESTERN: 'western',
};

// MovieBox content type identifiers
export const CONTENT_TYPE = {
  MOVIE: 1,
  SERIES: 2,
  ANIME: 3,
};

// Regional content identifiers
export const REGION = {
  HOLLYWOOD: 'us',
  NOLLYWOOD: 'ng',
  KDRAMA: 'kr',
  CHINESE: 'cn',
  JAPANESE: 'jp',
  INDIAN: 'in',
};

export const APP_VERSION = '6.3.1';
export const PACKAGE_NAME = 'com.lmc.moviebox';
export const PLATFORM = 'android';
