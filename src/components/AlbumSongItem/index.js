import moment from 'moment'

import './index.css'

const AlbumSongItem = props => {
  const {songData, isActive, trackNumber, displayInfo} = props
  const {selectSong, index} = props
  const {artists, name, durationMs} = songData

  const activeSongClass = isActive ? 'playingTrack' : 'nonePlaying'

  const onClickSelectSong = () => {
    selectSong(index)
  }

  const getDurationTime = inMilliSecs => {
    const inSecs = moment.duration(inMilliSecs).seconds()
    const inMins = moment.duration(inMilliSecs).minutes()

    if (inSecs < 10) {
      return `0${inMins}:0${inSecs}`
    }
    return `0${inMins}:${inSecs}`
  }

  return (
    <div className="tracks-container">
      <li
        onClick={onClickSelectSong}
        className={`track-item ${activeSongClass}`}
      >
        <div className="track-details">
          <p className="track-number">{trackNumber + 1}</p>
          <p className="track-name">{name}</p>
          <p className="album-name">{artists[0].name}</p>
          <p className="album-name">{getDurationTime(durationMs)}</p>
          <p className="album-name">{displayInfo.popularity}</p>
        </div>
        <p className="track-duration-md">{getDurationTime(durationMs)}</p>
      </li>
    </div>
  )
}

export default AlbumSongItem
