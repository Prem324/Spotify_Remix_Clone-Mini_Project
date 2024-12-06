import moment from 'moment'

import './index.css'

const SongItem = props => {
  const {songData, displayInfo, isActive, trackNumber} = props
  const {selectSong, index} = props
  const {artists, album, name, durationMs} = songData

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

  const getFormaDistance = added => {
    const addedAgo = moment(added, 'YYYYMMDD').fromNow()
    return addedAgo
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
          <p className="album-name">{album ? album.name : '(Album?)'}</p>
          <p className="track-duration-lg">{getDurationTime(durationMs)}</p>

          <p className="artist-name">{artists[0].name}</p>

          <p className="track-published-date">
            {album
              ? getFormaDistance(album.release_date)
              : getFormaDistance(displayInfo.releaseDate)}
          </p>
        </div>
        <p className="track-duration-md">{getDurationTime(durationMs)}</p>
      </li>
    </div>
  )
}

export default SongItem
