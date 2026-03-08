require('dotenv').config();
const express = require('express');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Log to 'web/server.log' so the user can easily find it
const logFile = path.join(__dirname, 'web', 'server.log');
function log(msg) {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ${msg}\n`;
    try {
        fs.appendFileSync(logFile, message);
    } catch (e) {
        // Fallback to console if file write fails
    }
    console.log(msg);
}

// Capture all Next.js errors
const originalError = console.error;
console.error = function () {
    const args = Array.from(arguments);
    const msg = args.map(a => (typeof a === 'object' && a !== null) ? (a.stack || JSON.stringify(a)) : String(a)).join(' ');
    log('[NEXT.JS ERROR] ' + msg);
    originalError.apply(console, arguments);
};

log('--- EXPRESS SERVER STARTUP (ROOT) ---');
log(`CWD: ${process.cwd()}`);
log(`__dirname: ${__dirname}`);
log(`NODE_ENV: ${process.env.NODE_ENV}`);
log(`PORT: ${process.env.PORT}`);
log(`DATABASE_HOST: ${process.env.DATABASE_HOST ? 'Present' : 'MISSING'}`);


const port = parseInt(process.env.PORT, 10) || 3000;
const dev = false;
// 0.0.0.0 is required on Hostinger's Node.js selector to listen on all interfaces
const hostname = '0.0.0.0';

const app = next({
    dev,
    hostname,
    port,
    dir: path.join(__dirname, 'web') // CRITICAL: Point to the 'web' folder where .next lives
});
const handle = app.getRequestHandler();

process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise} reason: ${reason}`);
});

process.on('uncaughtException', (err) => {
    log(`Uncaught Exception: ${err.message}`);
    log(err.stack);
    process.exit(1);
});

log('Preparing Next.js app (from root)...');
app.prepare().then(() => {
    log('Next.js app prepared successfully.');
    const server = express();

    // Trust proxy if behind Hostinger's reverse proxy
    server.set('trust proxy', 1);

    // Serve static files from the app's root 'public' directory
    // This allows manual uploads to Hostinger's default 'public' folder to work
    server.use(express.static(path.join(__dirname, 'public')));
    server.use(express.static(path.join(__dirname, 'web', 'public')));

    // Handle all requests with Next.js
    server.all(/.*/, (req, res) => {
        return handle(req, res);
    });

    server.listen(port, hostname, (err) => {
        if (err) {
            log(`FATAL: Failed to start server: ${err.message}`);
            throw err;
        }
        log(`> Express Server ready at http://${hostname}:${port}`);
    });
}).catch((err) => {
    log(`FATAL: Failed to prepare Next.js app: ${err.message}`);
    log(err.stack);
    process.exit(1);
});
