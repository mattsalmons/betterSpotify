const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: 'ad631922d2b44460a0572ea8326d9e7a',
    clientSecret: 'c7b2e10d5e024974abad57dd683fcd33',
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log(data.body)
    })
    .catch(() => {
      res.sendStatus(400);
    })
})

app.post('/login', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:3000',
    clientId: 'ad631922d2b44460a0572ea8326d9e7a',
    clientSecret: 'c7b2e10d5e024974abad57dd683fcd33'
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

app.listen(3001);