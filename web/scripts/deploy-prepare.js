const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('Preparing Express-based deployment...');

// rootDir here is 'web/' because this script is run via 'npm run build:prod' in 'web/package.json'
const webDir = process.cwd();
const parentDir = path.dirname(webDir);

const buildDir = path.join(webDir, 'build'); // Because distDir is 'build'

if (!fs.existsSync(buildDir)) {
    console.error('\n❌ Error: build directory not found. Did the Next.js build fail?');
    process.exit(1);
}

// 1. Create zip of the necessary structure for Hostinger
console.log('Zipping ready for Hostinger...');

const output = fs.createWriteStream(path.join(webDir, 'lkm-production.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function () {
    console.log(`\n✅ Production zip created successfully: lkm-production.zip (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
    console.log('\n--- HOSTINGER DEPLOYMENT INSTRUCTIONS ---');
    console.log('1. Upload lkm-production.zip to your Hostinger file manager (e.g. inside "nodejs" directory).');
    console.log('2. Extract the zip file replacing previous files (your public/uploads will NOT be overwritten).');
    console.log("3. Ensure your Node.js application points to 'server.js' as the startup file.");
    console.log("4. Restart your Node.js app inside Hostinger cPanel.");
    console.log('-----------------------------------------\n');
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

// Target structure inside ZIP:
// - server.js
// - package.json
// - web/
//     - next.config.ts
//     - package.json
//     - build/
//     - public/ (excluding uploads)

// Append root files
if (fs.existsSync(path.join(parentDir, 'server.js'))) {
    archive.file(path.join(parentDir, 'server.js'), { name: 'server.js' });
} else {
    console.error('⚠️ Warning: server.js not found in parent directory!');
}

if (fs.existsSync(path.join(parentDir, 'package.json'))) {
    archive.file(path.join(parentDir, 'package.json'), { name: 'package.json' });
}

// Append web dependencies
if (fs.existsSync(path.join(webDir, 'next.config.ts'))) {
    archive.file(path.join(webDir, 'next.config.ts'), { name: 'web/next.config.ts' });
}
if (fs.existsSync(path.join(webDir, 'package.json'))) {
    archive.file(path.join(webDir, 'package.json'), { name: 'web/package.json' });
}

// Append web/build directory
archive.directory(buildDir, 'web/build');

// Append web/public directory, EXCLUDING uploads
// Archiver doesn't have an easy exclude function for .directory(), 
// so we'll use glob exactly matching everything except uploads
archive.glob('**/*', {
    cwd: path.join(webDir, 'public'),
    ignore: ['uploads/**']
}, { prefix: 'web/public' });

// Ensure empty uploads directory with .gitkeep so Hostinger doesn't fail if the folder isn't there
archive.append('', { name: 'web/public/uploads/.gitkeep' });

archive.finalize();
