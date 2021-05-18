import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: 'ad631922d2b44460a0572ea8326d9e7a'
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }
     spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) {
      return setSearchResults([]);
    }
    if (!accessToken) {
      return;
    }

    spotifyApi.searchTracks(search)
      .then(res => {
        console.log(res.body.tracks.items);
      })
  }, [search, accessToken])

  const onChange = (e) => {
    setSearch(e.target.value);
  }

  return (
      <Container
        className='d-flex flex-column py-2'
        style={{ height: '100vh' }}>
        <Form.Control
          type="search"
          placeholder="lose yourself in the rhythm of..."
          value={search}
          onChange={onChange}
        />
        <div
          className='flex-grow-1 my-2'
          style={{ overflowY: 'auto' }}>
          songs
        </div>
        <div>bottom</div>
      </Container>
  )
}
