require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');

const app = express();
app.use(cors());
app.use(express.json());
// parse url params for lyrics
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    // redirectUri: 'http://localhost:3000',
    redirectUri: process.env.REDIRECT_URI,
    // clientId: 'ad631922d2b44460a0572ea8326d9e7a',
    clientId: process.env.CLIENT_ID,
    // clientSecret: 'c7b2e10d5e024974abad57dd683fcd33',
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn
      })
    })
    .catch(() => {
      res.sendStatus(400);
    })
})

app.post('/login', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    //  redirectUri: 'http://localhost:3000',
     redirectUri: process.env.REDIRECT_URI,
    //  clientId: 'ad631922d2b44460a0572ea8326d9e7a',
     clientId: process.env.CLIENT_ID,
    //  clientSecret: 'c7b2e10d5e024974abad57dd683fcd33',
     clientSecret: process.env.CLIENT_SECRET
  })

  spotifyApi.authorizationCodeGrant(code).then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(() => {
      res.sendStatus(400);
    })
})

app.get('/lyrics', async (req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track)
  || `









no lyrics found. but let's be real,
it's probably about want and/or loss...


and that's okay.`
  res.json({ lyrics })
})

app.listen(3001);