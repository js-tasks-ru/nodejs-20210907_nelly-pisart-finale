const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/') || pathname.includes('...')) {
    res.statusCode = 400;
    res.end('Nested folders are not supported');
    return;
  }

  switch (req.method) {
    case 'GET':
      const stream = fs.createReadStream(filepath);
      stream.pipe(res);

      stream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('File not found');
        } else {
          res.statusCode = 500;
          res.end('Internal error');
        }
        return;
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
