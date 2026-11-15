/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Local Development Server (Node.js)
 * 
 * Zero external dependencies. Uses native Node.js http, fs, path modules.
 * Run with: node server.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
    // Normalize URL
    let safeUrl = req.url.split('?')[0];
    if (safeUrl === '/') safeUrl = '/index.html';
    
    const filePath = path.join(__dirname, safeUrl);

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found: ' + safeUrl);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Server Error: ' + err.code);
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log('========================================================');
    console.log('  SPACE MISSION 3D – NASA EXPLORER');
    console.log('  NASA Space Apps Hackathon Simulation Server');
    console.log(`  Running at: http://localhost:${PORT}`);
    console.log('  Press Ctrl+C to stop the server.');
    console.log('========================================================');
});
