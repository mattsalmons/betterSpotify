import { useState, useEffect } from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)

  useEffect(() => {
    setPlay(true);
  }, [trackUri])

  if (!accessToken) return null;
  return <SpotifyPlayer
    token={accessToken}
    showSaveIcon
    callback={state => {
      if (!state.isPlaying) {
        setPlay(true);
      }
    }}
    play={play}
    autopPlay={true}
    uris={ trackUri ? [trackUri] : []}
    styles={{
      bgColor: '#222222',
      activeColor: '#B73239',
      color: '#666666',
      trackNameColor: '#666666',
      trackArtistColor: '#666666',
      sliderTrackColor: '#222222',
      sliderColor: '#666666',
      sliderHeight: '10px',
      height: '100px',
      magnifySliderOnHover: true
    }}
  />
}
