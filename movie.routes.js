import { Router } from 'express';
import * as ctrl from '../controllers/movie.controller.js';

const router = Router();

// ---------------------------------------------------------------------------
// Health check (also in app.js root, here for /api/v1 scoped check)
// ---------------------------------------------------------------------------
router.get('/health', (_req, res) =>
  res.json({ success: true, data: { status: 'ok', service: 'Cymor Movie API' } }),
);

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------
router.get('/home', ctrl.getHome);
router.get('/trending', ctrl.getTrending);
router.get('/search', ctrl.getSearch);

// ---------------------------------------------------------------------------
// Content Details  (generic + typed)
// ---------------------------------------------------------------------------
router.get('/details/:id', ctrl.getDetails);
router.get('/movie/:id', ctrl.getMovieDetails);
router.get('/series/:id', ctrl.getSeriesDetails);
router.get('/anime/:id', ctrl.getAnimeDetails);

// ---------------------------------------------------------------------------
// Streaming & Downloads
// ---------------------------------------------------------------------------
router.get('/stream/:id', ctrl.getStream);
router.get('/downloads/:id', ctrl.getDownloads);

// ---------------------------------------------------------------------------
// Latest
// ---------------------------------------------------------------------------
router.get('/latest/movies', ctrl.getLatestMovies);
router.get('/latest/series', ctrl.getLatestSeries);
router.get('/latest/anime', ctrl.getLatestAnime);
router.get('/anime', ctrl.getAnimeCategory);

// ---------------------------------------------------------------------------
// Regional
// ---------------------------------------------------------------------------
router.get('/hollywood', ctrl.getHollywood);
router.get('/nollywood', ctrl.getNollywood);
router.get('/kdrama', ctrl.getKdrama);
router.get('/chinese-drama', ctrl.getChineseDrama);
router.get('/japanese-drama', ctrl.getJapaneseDrama);
router.get('/indian-movies', ctrl.getIndianMovies);

// ---------------------------------------------------------------------------
// Genres
// ---------------------------------------------------------------------------
router.get('/genre/action', ctrl.getAction);
router.get('/genre/adventure', ctrl.getAdventure);
router.get('/genre/comedy', ctrl.getComedy);
router.get('/genre/drama', ctrl.getDrama);
router.get('/genre/fantasy', ctrl.getFantasy);
router.get('/genre/family', ctrl.getFamily);
router.get('/genre/animation', ctrl.getAnimation);
router.get('/genre/documentary', ctrl.getDocumentary);
router.get('/genre/mystery', ctrl.getMystery);
router.get('/genre/thriller', ctrl.getThriller);
router.get('/genre/crime', ctrl.getCrime);
router.get('/genre/sci-fi', ctrl.getScifi);
router.get('/genre/horror', ctrl.getHorror);
router.get('/genre/romance', ctrl.getRomance);
router.get('/genre/war', ctrl.getWar);
router.get('/genre/history', ctrl.getHistory);
router.get('/genre/music', ctrl.getMusic);
router.get('/genre/western', ctrl.getWestern);

// ---------------------------------------------------------------------------
// Curated Lists
// ---------------------------------------------------------------------------
router.get('/top-rated', ctrl.getTopRated);
router.get('/popular', ctrl.getPopular);
router.get('/recommended', ctrl.getRecommended);

// ---------------------------------------------------------------------------
// User features (future-ready)
// ---------------------------------------------------------------------------
router.get('/continue-watching', ctrl.getContinueWatching);
router.get('/favorites', ctrl.getFavorites);

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------
router.get('/subtitles/:id', ctrl.getSubtitles);
router.get('/cast/:id', ctrl.getCast);
router.get('/trailers/:id', ctrl.getTrailers);
router.get('/recommendations/:id', ctrl.getRecommendations);
router.get('/episodes/:id', ctrl.getEpisodes);
router.get('/seasons/:id', ctrl.getSeasons);

// ---------------------------------------------------------------------------
// Power-user escape hatch
// ---------------------------------------------------------------------------
router.get('/endpoint', ctrl.callEndpoint);

export default router;
