const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('\n--- HOSTINGER NODE.JS DIAGNOSTIC TOOL ---');
console.log('Timestamp:', new Date().toISOString());
console.log('Node version:', process.version);
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Environment PORT:', process.env.PORT);
console.log('Environment NODE_ENV:', process.env.NODE_ENV);

// 1. Check for critical files and directories
const checkPaths = [
    'package.json',
    'server.js',
    'web',
    'web/package.json',
    'web/build',
    'web/build/BUILD_ID',
    'web/server.js' // Checking if old one still exists
];

console.log('\n--- 1. File & Directory Check ---');
checkPaths.forEach(p => {
    const fullPath = path.resolve(p);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        console.log(`[OK] ${p} (${stats.isDirectory() ? 'DIR' : 'FILE'})`);
    } else {
        console.log(`[MISSING] ${p}`);
    }
});

// 2. Check Dependencies (Can we find Next.js?)
console.log('\n--- 2. Dependency Resolution Check ---');
try {
    const nextPath = require.resolve('next');
    console.log(`[OK] 'next' resolved at: ${nextPath}`);
} catch (e) {
    console.log(`[FAIL] Could not resolve 'next'. Build might have failed or npm install missed it.`);
}

try {
    const expressPath = require.resolve('express');
    console.log(`[OK] 'express' resolved at: ${expressPath}`);
} catch (e) {
    console.log(`[FAIL] Could not resolve 'express'.`);
}

// 3. Check for the custom log file
console.log('\n--- 3. Application Logs ---');
const logFilePath = path.join(__dirname, 'web', 'server.log');
if (fs.existsSync(logFilePath)) {
    console.log(`[FOUND] web/server.log exists. Last 5 lines:`);
    const logs = fs.readFileSync(logFilePath, 'utf8').split('\n').filter(Boolean).slice(-5);
    logs.forEach(line => console.log('  > ' + line));
} else {
    console.log(`[NOT FOUND] web/server.log (Server likely hasn't started yet)`);
}

// 4. Test Port Binding
const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = '0.0.0.0';

console.log(`\n--- 4. Port Binding Test (${hostname}:${port}) ---`);
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Diagnostic server reached successfully!\n');
});

server.on('error', (e) => {
    console.error(`[CRITICAL] Could not bind to port: ${e.message}`);
    if (e.code === 'EADDRINUSE') {
        console.log('Suggestion: Another process is already using this port.');
    } else {
        console.log('Check Hostinger dashboard settings.');
    }
    process.exit(1);
});

server.listen(port, hostname, () => {
    console.log(`[SUCCESS] Port binding successful.`);
    console.log('\nDIAGNOSTIC COMPLETE.');
    console.log('If all steps above are [OK/SUCCESS], the issue is likely the Hostinger Dashboard "Entry file" or "Root directory" mismatch.');

    // Shutdown after 5 seconds
    setTimeout(() => {
        process.exit(0);
    }, 5000);
});
