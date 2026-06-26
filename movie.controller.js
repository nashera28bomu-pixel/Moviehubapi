import * as movieboxService from '../services/moviebox.service.js';
import { successResponse, parsePagination, isNonEmptyString } from '../utils/helpers.js';

const send = (res, data) => res.status(200).json(successResponse(data));

const parseTypeFilter = (query) => (query.type ? String(query.type) : '');

// ---------------------------------------------------------------------------
// Homepage & Discovery
// ---------------------------------------------------------------------------

export const getHome = async (req, res) => {
  const { page } = parsePagination(req.query);
  const data = await movieboxService.home({ page });
  send(res, data);
};

export const getTrending = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  const data = await movieboxService.trending({ page, limit, type });
  send(res, data);
};

export const getSearch = async (req, res) => {
  const { q, query, page: rawPage, limit: rawLimit, type: rawType } = req.query;
  const searchQuery = q || query;

  if (!isNonEmptyString(searchQuery)) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'ValidationError',
      message: 'Query parameter `q` or `query` is required',
    });
  }

  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  const data = await movieboxService.search({ query: searchQuery.trim(), page, limit, type });
  send(res, data);
};

// ---------------------------------------------------------------------------
// Content Details
// ---------------------------------------------------------------------------

export const getDetails = async (req, res) => {
  const { id } = req.params;
  const type = parseTypeFilter(req.query);
  const data = await movieboxService.details({ id, type: type || undefined });
  send(res, data);
};

export const getMovieDetails = async (req, res) => {
  const { id } = req.params;
  const data = await movieboxService.movie({ id });
  send(res, data);
};

export const getSeriesDetails = async (req, res) => {
  const { id } = req.params;
  const data = await movieboxService.series({ id });
  send(res, data);
};

export const getAnimeDetails = async (req, res) => {
  const { id } = req.params;
  const data = await movieboxService.anime({ id });
  send(res, data);
};

// ---------------------------------------------------------------------------
// Streaming & Downloads
// ---------------------------------------------------------------------------

export const getStream = async (req, res) => {
  const { id } = req.params;
  const { episode, season, quality } = req.query;
  const data = await movieboxService.stream({ id, episode, season, quality });
  send(res, data);
};

export const getDownloads = async (req, res) => {
  const { id } = req.params;
  const { episode, season, quality } = req.query;
  const data = await movieboxService.downloads({ id, episode, season, quality });
  send(res, data);
};

// ---------------------------------------------------------------------------
// Latest Content
// ---------------------------------------------------------------------------

export const getLatestMovies = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.latestMovies({ page, limit });
  send(res, data);
};

export const getLatestSeries = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.latestSeries({ page, limit });
  send(res, data);
};

export const getLatestAnime = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.latestAnime({ page, limit });
  send(res, data);
};

// ---------------------------------------------------------------------------
// Regional Content
// ---------------------------------------------------------------------------

export const getHollywood = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.hollywood({ page, limit });
  send(res, data);
};

export const getNollywood = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.nollywood({ page, limit });
  send(res, data);
};

export const getKdrama = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.kdrama({ page, limit });
  send(res, data);
};

export const getChineseDrama = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.chineseDrama({ page, limit });
  send(res, data);
};

export const getJapaneseDrama = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.japaneseDrama({ page, limit });
  send(res, data);
};

export const getIndianMovies = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const data = await movieboxService.indianMovies({ page, limit });
  send(res, data);
};

// ---------------------------------------------------------------------------
// Genre / Category
// ---------------------------------------------------------------------------

export const getAction = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.action({ page, limit, type }));
};

export const getAdventure = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.adventure({ page, limit, type }));
};

export const getComedy = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.comedy({ page, limit, type }));
};

export const getDrama = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.drama({ page, limit, type }));
};

export const getFantasy = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.fantasy({ page, limit, type }));
};

export const getFamily = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.family({ page, limit, type }));
};

export const getAnimation = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.animation({ page, limit, type }));
};

export const getDocumentary = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.documentary({ page, limit, type }));
};

export const getMystery = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.mystery({ page, limit, type }));
};

export const getThriller = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.thriller({ page, limit, type }));
};

export const getCrime = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.crime({ page, limit, type }));
};

export const getScifi = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.scifi({ page, limit, type }));
};

export const getHorror = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.horror({ page, limit, type }));
};

export const getRomance = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.romance({ page, limit, type }));
};

export const getWar = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.war({ page, limit, type }));
};

export const getHistory = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.history({ page, limit, type }));
};

export const getMusic = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.music({ page, limit, type }));
};

export const getWestern = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.western({ page, limit, type }));
};

// ---------------------------------------------------------------------------
// Curated Lists
// ---------------------------------------------------------------------------

export const getTopRated = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.topRated({ page, limit, type }));
};

export const getPopular = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const type = parseTypeFilter(req.query);
  send(res, await movieboxService.popular({ page, limit, type }));
};

export const getRecommended = async (req, res) => {
  const { id, page, limit } = { id: req.query.id, ...parsePagination(req.query) };
  send(res, await movieboxService.recommended({ id, page, limit }));
};

// ---------------------------------------------------------------------------
// User Features (future-ready)
// ---------------------------------------------------------------------------

export const getContinueWatching = async (req, res) => {
  const userId = req.query.userId || '';
  send(res, await movieboxService.continueWatching({ userId }));
};

export const getFavorites = async (req, res) => {
  const userId = req.query.userId || '';
  send(res, await movieboxService.favorites({ userId }));
};

// ---------------------------------------------------------------------------
// Metadata endpoints
// ---------------------------------------------------------------------------

export const getSubtitles = async (req, res) => {
  const { id } = req.params;
  const { episode, season, language } = req.query;
  send(res, await movieboxService.subtitles({ id, episode, season, language }));
};

export const getCast = async (req, res) => {
  const { id } = req.params;
  send(res, await movieboxService.cast({ id }));
};

export const getTrailers = async (req, res) => {
  const { id } = req.params;
  send(res, await movieboxService.trailers({ id }));
};

export const getRecommendations = async (req, res) => {
  const { id } = req.params;
  const { page, limit } = parsePagination(req.query);
  send(res, await movieboxService.recommendations({ id, page, limit }));
};

export const getEpisodes = async (req, res) => {
  const { id } = req.params;
  const season = parseInt(req.query.season || '1', 10);
  send(res, await movieboxService.episodes({ id, season }));
};

export const getSeasons = async (req, res) => {
  const { id } = req.params;
  send(res, await movieboxService.seasons({ id }));
};

// ---------------------------------------------------------------------------
// Power-user escape hatch
// ---------------------------------------------------------------------------

export const callEndpoint = async (req, res) => {
  const { path } = req.query;

  if (!isNonEmptyString(path)) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'ValidationError',
      message: 'Query parameter `path` is required',
    });
  }

  const { path: _path, ...params } = req.query;
  send(res, await movieboxService.endpoint({ path, params }));
};

export const getAnimeCategory = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  send(res, await movieboxService.animeCategory({ page, limit }));
};
