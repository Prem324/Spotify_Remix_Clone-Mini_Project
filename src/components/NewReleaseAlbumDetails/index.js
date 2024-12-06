import {Component} from 'react'
import Cookies from 'js-cookie'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import Navbar from '../Navbar'
import AlbumPlayer from '../AlbumPlayer'

import './index.css'

const apiStatusConstants = {
  initial: 'INITAIL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class NewReleaseAlbumDetails extends Component {
  state = {
    musicList: [],
    displayInfo: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getAlbumDetailsData()
  }

  getAlbumDetailsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {playlistId} = params
    console.log(this.props)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis2.ccbp.in/spotify-clone/album-details/${playlistId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const reponse = await fetch(apiUrl, options)

    if (reponse.ok) {
      const data = await reponse.json()
      console.log(data)

      const updatedAlbumDetailsInfo = {
        albumType: data.album_type,
        artists: data.artists,
        availableMarkets: data.available_markets,
        copyrights: data.copyrights,
        externalIds: data.external_ids,
        externalUrls: data.external_urls,
        genres: data.genres,
        href: data.href,
        id: data.id,
        images: data.images,
        label: data.label,
        name: data.name,
        popularity: data.popularity,
        releaseDate: data.release_date,
        releaseDatePrecision: data.release_date_precision,
        totalTracks: data.total_tracks,
        tracks: data.tracks,
        type: data.type,
        uri: data.uri,
      }

      const updatedAlbumTracksData = data.tracks.items.map(item => ({
        artists: item.artists,
        availableMarkets: item.available_markets,
        discNumber: item.disc_number,
        durationMs: item.duration_ms,
        episode: item.episode,
        explicit: item.explicit,
        externalUrls: item.external_urls,
        href: item.href,
        id: item.id,
        isLocal: item.is_local,
        name: item.name,
        previewUrl: item.preview_url,
        trackNumber: item.track_number,
        type: item.type,
        uri: item.uri,
      }))
      this.setState({
        musicList: updatedAlbumTracksData,
        displayInfo: updatedAlbumDetailsInfo,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderAlbumDetails = () => {
    const {musicList, displayInfo} = this.state
    return (
      <AlbumPlayer
        musicList={musicList}
        displayInfo={displayInfo}
        section="New Releases"
      />
    )
  }

  onTryAgain = () => {
    this.getAlbumDetailsData()
  }

  renderFailureView = () => <FailureView onTryAgain={this.onTryAgain} />

  renderLoadingView = () => <LoaderView />

  renderApiStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAlbumDetails()
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
      <div className="album-details-responsive-container">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="album-details-container">
          {this.renderApiStatusView()}
        </div>
      </div>
    )
  }
}

export default NewReleaseAlbumDetails
