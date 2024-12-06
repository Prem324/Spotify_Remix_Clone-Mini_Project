import React, {Component} from 'react'

import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaRedo,
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa'
import AlbumSongItem from '../AlbumSongItem'
import AlbumDisplayInfo from '../AlbumDisplayInfo'
import BackNavigation from '../BackNavigation'

import './index.css'

class AlbumPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.props,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.7,
      trackIndex: null,
      isMuted: false,
      searchQuery: '',
      isShuffling: false,
      isRepeating: false,
      favorites: [],
    }
    this.audioRef = React.createRef()
  }

  componentDidMount() {
    const {trackIndex} = this.state
    if (trackIndex !== null) {
      this.loadTrack(trackIndex)
    }
    if (this.audioRef.current) {
      this.audioRef.current.addEventListener(
        'timeupdate',
        this.handleTimeUpdate,
      )
      this.audioRef.current.addEventListener(
        'loadedmetadata',
        this.handleMetadataLoaded,
      )
      this.audioRef.current.addEventListener(
        'canplaythrough',
        this.handleCanPlayThrough,
      )
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {trackIndex, isMuted, isRepeating} = this.state
    if (prevState.trackIndex !== trackIndex && trackIndex !== null) {
      this.loadTrack(trackIndex)
    }
    if (prevState.isMuted !== isMuted) {
      this.handleMuteToggle()
    }
    if (prevState.isRepeating !== isRepeating && isRepeating) {
      this.audioRef.current.currentTime = 0 // Restart track when repeat is enabled
    }
    if (this.audioRef.current && prevState.trackIndex !== trackIndex) {
      this.audioRef.current.addEventListener(
        'timeupdate',
        this.handleTimeUpdate,
      )
      this.audioRef.current.addEventListener(
        'loadedmetadata',
        this.handleMetadataLoaded,
      )
      this.audioRef.current.addEventListener(
        'canplaythrough',
        this.handleCanPlayThrough,
      )
    }
  }

  componentWillUnmount() {
    if (this.audioRef.current) {
      this.audioRef.current.removeEventListener(
        'timeupdate',
        this.handleTimeUpdate,
      )
      this.audioRef.current.removeEventListener(
        'loadedmetadata',
        this.handleMetadataLoaded,
      )
      this.audioRef.current.removeEventListener(
        'canplaythrough',
        this.handleCanPlayThrough,
      )
    }
  }

  loadTrack = trackIndex => {
    const {musicList} = this.state
    const audio = this.audioRef.current
    const track = musicList[trackIndex]
    audio.src = track.previewUrl
    audio.load()
    this.setState({currentTime: 0, duration: audio.duration})
  }

  handleCanPlayThrough = () => {
    const {isPlaying} = this.state
    if (isPlaying) {
      this.audioRef.current.play()
    }
  }

  handleTrackSelect = trackId => {
    const {musicList} = this.state
    const trackIndex = musicList.findIndex(track => track.id === trackId)
    this.setState({trackIndex, isPlaying: true}, () => {
      this.loadTrack(trackIndex)
      this.audioRef.current.play()
    })
  }

  handlePlayPause = () => {
    const {isPlaying} = this.state
    const audio = this.audioRef.current
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    this.setState(prevState => ({isPlaying: !prevState.isPlaying}))
  }

  handleSeek = e => {
    const {duration} = this.state
    const audio = this.audioRef.current
    const progressBar = e.target
    const newTime = (e.nativeEvent.offsetX / progressBar.offsetWidth) * duration
    if (Number.isFinite(newTime)) {
      audio.currentTime = newTime
    }
  }

  handleVolumeChange = e => {
    const volume = e.target.value
    this.setState({volume})
    this.audioRef.current.volume = volume
  }

  handleNextTrack = () => {
    const {musicList, trackIndex, isShuffling, isRepeating} = this.state
    if (trackIndex === null) return
    let nextTrackIndex
    if (isRepeating) {
      this.audioRef.current.currentTime = 0
      this.audioRef.current.play()
      return
    }
    if (isShuffling) {
      nextTrackIndex = Math.floor(Math.random() * musicList.length)
    } else {
      nextTrackIndex = (trackIndex + 1) % musicList.length
    }
    this.setState({trackIndex: nextTrackIndex}, () => {
      this.loadTrack(nextTrackIndex)
      this.audioRef.current.play()
    })
  }

  handlePrevTrack = () => {
    const {musicList, trackIndex} = this.state
    if (trackIndex === null) return
    const prevTrackIndex =
      (trackIndex - 1 + musicList.length) % musicList.length
    this.setState({trackIndex: prevTrackIndex})
  }

  handleTimeUpdate = () => {
    const audio = this.audioRef.current
    if (Number.isFinite(audio.currentTime)) {
      this.setState({
        currentTime: audio.currentTime,
      })
    }
  }

  handleMetadataLoaded = () => {
    const audio = this.audioRef.current
    if (Number.isFinite(audio.duration)) {
      this.setState({
        duration: audio.duration,
      })
    }
  }

  formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`
  }

  formatTimeDecrease = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes < 10 ? `-0${minutes}` : minutes}:${
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
    }`
  }

  handleMuteToggle = () => {
    const {isMuted, volume} = this.state
    const audio = this.audioRef.current
    if (isMuted) {
      audio.muted = true
      audio.volume = 0
    } else {
      audio.muted = false
      audio.volume = volume
    }
  }

  handleShuffleToggle = () => {
    this.setState(prevState => ({isShuffling: !prevState.isShuffling}))
  }

  handleRepeatToggle = () => {
    this.setState(prevState => ({isRepeating: !prevState.isRepeating}))
  }

  handleFavoriteToggle = trackId => {
    this.setState(prevState => {
      const favorites = prevState.favorites.includes(trackId)
        ? prevState.favorites.filter(id => id !== trackId)
        : [...prevState.favorites, trackId]
      return {favorites}
    })
  }

  // Handle Search Query Change
  handleSearchQueryChange = e => {
    this.setState({searchQuery: e.target.value})
  }

  // Filter Music List based on Search Query
  getFilteredMusicList = () => {
    const {musicList, searchQuery} = this.state
    if (!searchQuery) return musicList
    return musicList.filter(track =>
      track.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  renderPlayer = () => {
    const {
      isPlaying,
      currentTime,
      duration,
      volume,
      trackIndex,
      musicList,
      isMuted,
      isShuffling,
      isRepeating,
      favorites,
      displayInfo,
    } = this.state
    const track = trackIndex !== null ? musicList[trackIndex] : null

    // Only render the player if a track is selected
    if (!track) return null
    const trackDuration = duration - currentTime
    return (
      <div className="audio-player">
        {track && (
          <div className="player-details">
            <img
              className="player-thumbnail"
              src={displayInfo.images[0].url}
              alt="album"
            />
            <div className="player-content">
              <p className="player-track-name">{track.name}</p>
              <div className="player-artists-list">
                {track.artists.map(artist => (
                  <span className="player-track-artist" key={artist.name}>
                    {`${artist.name}, `}
                  </span>
                ))}
              </div>
            </div>
            <button
              className="favourite-track"
              type="button"
              onClick={() => track && this.handleFavoriteToggle(track.id)}
            >
              {track && favorites.includes(track.id) ? (
                <FaHeart className="fav-icon" color="red" />
              ) : (
                <FaRegHeart className="fav-icon" />
              )}
            </button>
          </div>
        )}

        <div className="track-controls-container">
          <div className="track-controls-section">
            <button
              className="shuffle-tracks"
              type="button"
              onClick={this.handleShuffleToggle}
            >
              <FaRandom
                className="shuffle"
                color={isShuffling ? 'green' : 'gray'}
              />
            </button>
            <button
              className="previous-track"
              type="button"
              onClick={this.handlePrevTrack}
            >
              <FaStepBackward className="track-switch" />
            </button>
            <button
              className="play-pause"
              type="button"
              onClick={this.handlePlayPause}
            >
              {isPlaying ? (
                <FaPause className="play" />
              ) : (
                <FaPlay className="pause" />
              )}
            </button>
            <button
              className="next-track"
              type="button"
              onClick={this.handleNextTrack}
            >
              <FaStepForward className="track-switch" />
            </button>
            <button
              className="repeat-track"
              type="button"
              onClick={this.handleRepeatToggle}
            >
              <FaRedo
                className="repeat"
                color={isRepeating ? 'green' : 'gray'}
              />
            </button>
          </div>

          <div className="track-progress">
            <div className="track-duration">
              <span>{this.formatTime(currentTime)}</span>
            </div>
            <button
              className="seek-bar-container"
              type="button"
              onClick={this.handleSeek}
              aria-label="Seek Bar"
            >
              <i
                className="seek-bar"
                style={{width: `${(currentTime / duration) * 100}%`}}
              />
            </button>
            <div className="track-duration">
              <span>{this.formatTimeDecrease(trackDuration)}</span>
            </div>
          </div>
        </div>

        <div className="volume-control-section">
          <button
            className="volume-control-button"
            type="button"
            onClick={() =>
              this.setState(prevState => ({isMuted: !prevState.isMuted}))
            }
          >
            {isMuted ? (
              <FaVolumeMute className="volume-icon" />
            ) : (
              <FaVolumeUp className="volume-icon" />
            )}
          </button>
          <div>
            <input
              className="volume-control-slider"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={this.handleVolumeChange}
            />
          </div>

          <audio ref={this.audioRef} onEnded={this.handleNextTrack}>
            <track kind="captions" srcLang="en" />
          </audio>
        </div>
      </div>
    )
  }

  renderSongsList = () => {
    const filteredMusicList = this.getFilteredMusicList()
    const {trackIndex, displayInfo} = this.state
    return (
      <div className="tracks-list">
        {filteredMusicList.map((trackItem, index) => (
          <AlbumSongItem
            songData={trackItem}
            key={trackItem.id}
            trackNumber={index}
            isActive={trackIndex === index}
            displayInfo={displayInfo}
            selectSong={() => this.handleTrackSelect(trackItem.id)} // Pass track ID instead of index
          />
        ))}
      </div>
    )
  }

  render() {
    const {searchQuery, displayInfo, section} = this.state
    return (
      <div className="player-container">
        <BackNavigation />
        <div className="playlist-container">
          <AlbumDisplayInfo displayInfo={displayInfo} section={section} />
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              value={searchQuery}
              onChange={this.handleSearchQueryChange}
              placeholder="Search by track name"
            />
          </div>
          <div className="tracks-list-headers">
            <p className="track-number-header">#</p>
            <p className="track-name-header">Track</p>
            <p className="track-name-header">Artist</p>
            <p className="track-name-header">Time</p>
            <p className="track-added-header">Popularity</p>
          </div>
          <div>{this.renderSongsList()}</div>
          <div>{this.renderPlayer()}</div>
        </div>
      </div>
    )
  }
}

export default AlbumPlayer
