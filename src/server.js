import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { config } from './config/index.js';
import cache from './config/cache.js';

const { port, nodeEnv } = config.server;

const server = http.createServer(app);

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
const shutdown = (signal) => {
  console.log(`\n[Server] Received ${signal}. Starting graceful shutdown…`);

  server.close((err) => {
    if (err) {
      console.error('[Server] Error during shutdown:', err.message);
      process.exit(1);
    }

    cache.clear();
    console.log('[Server] Cache cleared. Goodbye.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[Server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught exception:', err.message);
  process.exit(1);
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
server.listen(port, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║       CYMOR MOVIE API  v1.0.0         ║');
  console.log('  ║    by Legendary Smiley Cymor           ║');
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`  🎬  Server    : http://localhost:${port}`);
  console.log(`  🌍  Env       : ${nodeEnv}`);
  console.log(`  📡  API Base  : http://localhost:${port}/api/v1`);
  console.log('');
});

export default server;
