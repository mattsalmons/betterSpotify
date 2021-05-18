import React from 'react'

export default function TrackSearchResult({ track, chooseTrack }) {
  const handlePlay = () => {
    chooseTrack(track);
  }
  return (
    <div
      className="d-flex m-2 align-items-center"
      style={{ cursor: 'pointer' }}
      onClick={handlePlay}>
      <img
        src={track.albumUrl}
        style={{ height: '75px', width: '75px' }}
        alt=''
      />
      <div style={{ marginLeft: '10px'}}>
        <div>{track.title}</div>
        <div className="text-muted">{track.artist}</div>
      </div>
    </div>
  )
}
