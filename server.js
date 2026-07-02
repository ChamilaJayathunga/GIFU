const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, url);
  const ext = path.extname(url).slice(1);
  const types = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    pdf: 'application/pdf'
  };
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404');
    } else {
      res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
      res.end(data);
    }
  });
}).listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
