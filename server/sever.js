const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.post('/login', (req, res) => {
  const code = req.body.code:
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: 'ad631922d2b44460a0572ea8326d9e7a',
    clientSecret: 'c7b2e10d5e024974abad57dd683fcd33'
  })

  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        refreshToken: data.body.refreshToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(() => {
      res.sendStatus(400);
    })
})