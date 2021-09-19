const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitedSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/') || pathname.includes('...')) {
    res.statusCode = 400;
    res.end('Nested folders are no supported');
  }

  switch (req.method) {
    case 'POST':
      const stream = fs.createWriteStream(filepath, {
        flags: 'wx',
      });
      const limitSizeStream = new LimitedSizeStream({ limit: 10 });

      req.pipe(limitSizeStream).pipe(stream);

      stream.on('finish', () => {
        res.end('File saved');
      })

      limitSizeStream.on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('Large file');                    
        } else {
          res.statusCode = 500;
          res.end('Internal error');  
        }

        stream.destroy();
        fs.unlink(filepath, error => {});
      })

      stream.on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        }
        res.statusCode = 500;
        res.end('Internal error');
      })

      req.on('aborted', () => {
        stream.destroy();
        limitSizeStream.destroy();
        fs.unlink(filepath, error => {});
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
