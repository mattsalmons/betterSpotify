import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';

const spotifyApi = new SpotifyWebApi({
  clientId: 'ad631922d2b44460a0572ea8326d9e7a'
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
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
          {searchResults.map(track => (
            <TrackSearchResult track={track} key={track.uri} />
          ))}
        </div>
        <div>bottom</div>
      </Container>
  )
}
