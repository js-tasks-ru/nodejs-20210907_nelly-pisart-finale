const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Nested folders are no supported');
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (error) => {
        if (error) {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('File not found');
          } else {
            res.statusCode = 500;
            res.end('Internal error');
          }
        } else {
          res.end('File was deleted')
        }
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
