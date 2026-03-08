const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Log to a file so we can see what's happening on Hostinger
const logFile = path.join(__dirname, 'server.log');
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

log('--- SERVER STARTUP ---');
log(`CWD: ${process.cwd()}`);
log(`__dirname: ${__dirname}`);
log(`NODE_ENV: ${process.env.NODE_ENV}`);
log(`PORT: ${process.env.PORT}`);

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = false;
// 0.0.0.0 is required on Hostinger's Node.js selector to listen on all interfaces
const hostname = '0.0.0.0';

const app = next({
    dev,
    hostname,
    port,
    dir: __dirname // Ensure Next.js finds the .next folder in 'web/'
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

log('Preparing Next.js app...');
app.prepare().then(() => {
    log('Next.js app prepared successfully.');
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            log(`Error handling ${req.url}: ${err.message}`);
            res.statusCode = 500;
            res.end('Internal server error');
        }
    })
        .once('error', (err) => {
            log(`Server error: ${err.message}`);
            process.exit(1);
        })
        .listen(port, hostname, () => {
            log(`Server listening on http://${hostname}:${port}`);
        });
}).catch((err) => {
    log(`FATAL: Failed to prepare Next.js app: ${err.message}`);
    log(err.stack);
    process.exit(1);
});
