const { USER, API_KEY, API_SECRET } = require('./config.js');
const { LastFmNode } = require('lastfm');

const lastfm = new LastFmNode({
  api_key: API_KEY,
  secret: API_SECRET
});

const trackStream = lastfm.stream(USER);

module.exports = trackStream;