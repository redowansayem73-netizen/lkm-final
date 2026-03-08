const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = false;
// On Hostinger, 'localhost' is often safer for the reverse proxy than '0.0.0.0'
const hostname = 'localhost';

console.log(`> Starting server in ${process.env.NODE_ENV} mode...`);
console.log(`> Port: ${port}`);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

app.prepare().then(() => {
    createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('Internal server error');
        }
    })
        .once('error', (err) => {
            console.error('Server error:', err);
            process.exit(1);
        })
        .listen(port, hostname, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
}).catch((err) => {
    console.error('Failed to prepare Next.js app:', err);
    process.exit(1);
});
