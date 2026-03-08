const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('--- Hostinger Deployment Debugger ---');
console.log('Node version:', process.version);
console.log('Current working directory:', process.cwd());
console.log('Environment PORT:', process.env.PORT);
console.log('Environment NODE_ENV:', process.env.NODE_ENV);

// Check for critical files
const filesToCheck = [
    'package.json',
    'web/package.json',
    'web/server.js',
    'web/.next/BUILD_ID',
    'web/.next/standalone/server.js',
    'web/.next/static/chunks/main.js'
];

console.log('\n--- Checking Files ---');
filesToCheck.forEach(file => {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
        console.log(`[OK] ${file} exists`);
    } else {
        console.log(`[MISSING] ${file} NOT found`);
    }
});

// Try to start a dummy server on the provided port
const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = '0.0.0.0';

console.log(`\n--- Testing Port Binding on ${hostname}:${port} ---`);

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Debug Server is running!\n');
});

server.on('error', (e) => {
    console.error('[ERROR] Failed to start server:', e.message);
    if (e.code === 'EADDRINUSE') {
        console.log('Reason: Port is already in use.');
    } else if (e.code === 'EACCES') {
        console.log('Reason: Permission denied (port < 1024 or restricted).');
    }
    process.exit(1);
});

server.listen(port, hostname, () => {
    console.log(`\n[SUCCESS] Server started successfully on port ${port}`);
    console.log('If you see this and still get 503, the issue might be your Hostinger Setup (Startup file or Proxy)');

    // Auto-shutdown after 10 seconds to not block
    setTimeout(() => {
        console.log('\nDebug complete. Shutting down.');
        process.exit(0);
    }, 10000);
});
