import { useState, useEffect }from 'react';
import axios from 'axios';

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    axios
    .post('http://localhost:3001/login', {
      code
    })
    .then(res => {
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setExpiresIn(res.data.expiresIn);
      // removes code from url
      window.history.pushState({}, null, '/')
    }).catch((err) => {
      window.location = '/';
    })
  }, [code])

  useEffect(() => {
    axios
      .post('http://localhost:3001/refresh', {
        refreshToken
      })
      .then(res => {
        // setAccessToken(res.data.accessToken);
        // setRefreshToken(res.data.refreshToken);
        // setExpiresIn(res.data.expiresIn);
        // // removes code from url
        // window.history.pushState({}, null, '/')
      }).catch((err) => {
        window.location = '/';
      })
  }, [refreshToken, expiresIn])

  return accessToken
}
