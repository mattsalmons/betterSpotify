import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import { Container, Form } from 'react-bootstrap'
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';

import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
  clientId: 'ad631922d2b44460a0572ea8326d9e7a'
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [userData, setUserData] = useState()
  console.log(userData);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState(`
  music has the power to move mountains and change lives.
        a listener can get lost in one line,
                            yet find themself in another.

  search above for the right song at the right time...
                                                                        but choose wisely.

  with great power comes great resposibility.
  `);
  const [placeholderText, setPlaceholderText] = useState('');

  const chooseTrack = (track) => {
    setPlayingTrack(track);
    setSearch('');
    setLyrics('');
    setPlaceholderText(`${track.artist}: ${track.title}`)
    setBackgroundImage(track.backgroundImage)
  }

  const styles = {
    background: {
      position: 'relative',
      height: '100vh',
      backgroundImage: `url(${backgroundImage})`,
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      overflowY: 'auto',
    },

    lyrics: {
      height: '100vh',
      whiteSpace: 'pre',
      color: '#666666',
      fontFamily: 'Montserrat',
      backgroundColor: 'rgba(34, 34, 34, 0.97)',
      overflowY: 'auto'
    }
  }

  const onChange = (e) => {
    setSearch(e.target.value);
  }

  // get lyrics
  useEffect(() => {
    if (!playingTrack) return;
    axios.get('http://localhost:3001/lyrics', {
      params: {
        track: playingTrack.title,
        artist: playingTrack.artist
      }
    }).then(res => {
      setLyrics(res.data.lyrics);
    })
  })

  // set accessToken
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  // setSearchResults
  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          // get smallest image URL
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )
          // get largest image URL
          const largestAlbumImage = track.album.images.reduce(
            (largest, image) => {
              if (image.height > largest.height) return image
              return largest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
            backgroundImage: largestAlbumImage.url,
            album: track.album.name,
            albumUri: track.album.albumUri
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  // getUser
  useEffect(() => {
    if (!accessToken) return
    spotifyApi.getMe()
      .then(res => {
        setUserData(res.body)
      }, function(err) {
        console.log('Something went wrong!', err);
      });
  }, [accessToken])


  return (
      <Container
        className='d-flex flex-column py-2'
        style={{ height: '100vh' }}>
        <Form.Control
          className="input"
          type="search"
          size="lg"
          placeholder={placeholderText}
          value={search}
          style={{
            backgroundColor: '#222222',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'solid thin',
            borderColor: '#666666',
            color: '#666666',
            fontFamily: 'Montserrat'
          }}
          onChange={onChange}
        />
        <div
          className='flex-grow-1 my-2'
          style={{ overflowY: 'auto', height: '100vh' }}>
          >
          {searchResults.map(track => (
            <TrackSearchResult
              key={track.uri}
              track={track}
              chooseTrack={chooseTrack}
            />
          ))}
          {!searchResults.length && (
            <div style={styles.background}>
               <div className="text-center lyrics" style={styles.lyrics}>
              {lyrics}
              </div>
            </div>
          )}
        </div>
          {playingTrack ?
          <div>
            <Player
            accessToken={accessToken}
            trackUri={playingTrack?.uri}/>
            </div> : null
           }

      </Container>
  )
}
