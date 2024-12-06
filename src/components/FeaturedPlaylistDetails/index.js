import {Component} from 'react'
import Cookies from 'js-cookie'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import Navbar from '../Navbar'
import Player from '../Player'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class FeaturedPlaylistDetails extends Component {
  state = {
    musicList: [],
    displayInfo: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getSpecificPlaylist()
  }

  getSpecificPlaylist = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {playlistId} = params

    const jwtToken = Cookies.get('jwt_token')
    const specificPlaylistApiUrl = `https://apis2.ccbp.in/spotify-clone/playlists-details/${playlistId}`
    const specificPlaylistOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      specificPlaylistApiUrl,
      specificPlaylistOptions,
    )

    if (response.ok) {
      const data = await response.json()
      console.log(data)

      const updatedPlaylistInfo = {
        collaborative: data.collaborative,
        description: data.description,
        externalUrls: data.external_urls,
        href: data.href,
        id: data.id,
        images: data.images,
        name: data.name,
        owner: data.owner,
        primaryColor: data.primary_color,
        public: data.public,
        snapshotId: data.snapshot_id,
        tracks: data.tracks,
        type: data.type,
        uri: data.uri,
      }

      const updatedTracksData = data.tracks.items.map(item => ({
        album: item.track.album,
        artists: item.track.artists,
        availableMarkets: item.track.available_markets,
        discNumber: item.track.disc_number,
        durationMs: item.track.duration_ms,
        episode: item.track.episode,
        explicit: item.track.explicit,
        externalIds: item.track.external_ids,
        externalUrls: item.track.external_urls,
        href: item.track.href,
        id: item.track.id,
        isLocal: item.track.is_local,
        name: item.track.name,
        popularity: item.track.popularity,
        previewUrl: item.track.preview_url,
        track: item.track.track,
        trackNumber: item.track.track_number,
        type: item.track.type,
        uri: item.track.uri,
      }))
      this.setState({
        musicList: updatedTracksData,
        displayInfo: updatedPlaylistInfo,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSpecificPlaylist = () => {
    const {musicList, displayInfo} = this.state
    return (
      <Player
        musicList={musicList}
        displayInfo={displayInfo}
        section="Editor's Picks"
      />
    )
  }

  onTryAgain = () => {
    this.getSpecificPlaylist()
  }

  renderFailureView = () => <FailureView onTryAgain={this.onTryAgain} />

  renderLoadingView = () => <LoaderView />

  renderApiStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSpecificPlaylist()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="featured-playlist-responsive-container">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="featured-playlist-container">
          {this.renderApiStatusView()}
        </div>
      </div>
    )
  }
}

export default FeaturedPlaylistDetails
