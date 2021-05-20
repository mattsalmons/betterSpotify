import React from 'react'

export default function Playlist({ playlist, chooseTrack }) {

  const handlePlay = () => {
    chooseTrack(playlist);
  }

  return (
    <div
      className={"d-flex justify-content-around"}
      style={{
      color: '#666666',
      justifyContent: 'center'
    }}>
      <img
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
