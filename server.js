const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url;
  let p = path.join(process.cwd(), url.split('?')[0]);

  let extname = String(path.extname(p)).toLowerCase();
  let contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(p, (err, data) => {
    if (err) {
      console.error(err);
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(8081, () => console.log('Server running at http://localhost:8081/'));
