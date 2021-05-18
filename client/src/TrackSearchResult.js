import React from 'react'

export default function TrackSearchResult({ track }) {
  return (
    <div className='d-flex m-2 align-itesm-center'>
      <img
        src={track.albumUrl}
        style={{ height: '75px', width: '75px' }}
        alt=''
      />
    </div>
  )
}
