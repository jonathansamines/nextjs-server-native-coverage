'use strict';

const util = require('util');
const { once } = require('events');
const { parse } = require('url')
const { createServer } = require('http')
const next = require('next')

const defaults = {
  dev: true,
};

async function createCustomServer(opts) {
  const options = { ...defaults, ...opts };

  const app = next(options);
  const handle = app.getRequestHandler();

  await app.prepare();

  // Note: should be unnecessary
  process.removeAllListeners();

  const server = createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  });

  server.closeAsync = util.promisify(server.close);
  server.listen(3000);

  await once(server, 'listening');

  return server;
}

module.exports = { createCustomServer };