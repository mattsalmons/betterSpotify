import React from 'react'

export default function Playlist({ playlist, chooseTrack, handlePlaylistClick }) {

  const handlePlay = () => {
    chooseTrack(playlist);
  }

  return (
    <div
      className={"d-flex justify-content-around"}
      onClick={handlePlaylistClick}
      style={{
      color: '#666666',
      justifyContent: 'center'
    }}>
      <img
        className="playlist"
        alt=''
        src={`${playlist.images[1].url}`}
        onClick={handlePlay}
        style={{
          height: '100px',
          cursor: 'pointer'
        }}
      />
    </div>
  )
}
