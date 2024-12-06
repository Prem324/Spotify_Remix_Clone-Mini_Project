import {Component} from 'react'
import Cookies from 'js-cookie'
import FeaturedPlaylist from '../FeaturedPlaylist'
import FailureView from '../FailureView'
import LoaderView from '../LoaderView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Section1 extends Component {
  state = {
    featuredPlaylistsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getFeaturedPlaylistsData()
  }

  getFeaturedPlaylistsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const featuredPlaylistsApiUrl =
      'https://apis2.ccbp.in/spotify-clone/featured-playlists'

    const featuredPlaylistsOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const featuredPlaylistsResponse = await fetch(
      featuredPlaylistsApiUrl,
      featuredPlaylistsOptions,
    )
    if (featuredPlaylistsResponse.ok) {
      const featuredPlaylistsData = await featuredPlaylistsResponse.json()
      const upatedPlaylistsData = featuredPlaylistsData.playlists.items.map(
        item => ({
          id: item.id,
          name: item.name,
          images: item.images,
        }),
      )
      this.setState({
        featuredPlaylistsData: upatedPlaylistsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderEditorsPicksList = () => {
    const {featuredPlaylistsData} = this.state
    return (
      <div className="editors-picks-container">
        <h1 className="editors-picks-heading">Editor&apos;s picks</h1>
        <ul className="editors-picks-list">
          {featuredPlaylistsData.map(item => (
            <FeaturedPlaylist featuredPlaylistsData={item} key={item.id} />
          ))}
        </ul>
      </div>
    )
  }

  onTryAgain = () => {
    this.getFeaturedPlaylistsData()
  }

  renderLoadingView = () => <LoaderView />

  renderFailureView = () => <FailureView onTryAgain={this.onTryAgain} />

  renderApiStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderEditorsPicksList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderApiStatusView()}</div>
  }
}

export default Section1
