import {Component} from 'react'
import Cookies from 'js-cookie'
import CategoryPlaylistItem from '../CategoryPlaylistItem'
import BackNavigation from '../BackNavigation'
import LoaderView from '../LoaderView'
import FailureView from '../FailureView'
import Navbar from '../Navbar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CategoryPlaylists extends Component {
  state = {specificGenreDetailsData: [], apiStatus: apiStatusConstants.initial}

  componentDidMount = () => {
    this.getSpecificGenreDetails()
  }

  getSpecificGenreDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {playlistId} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis2.ccbp.in/spotify-clone/category-playlists/${playlistId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedGenreDetailsData = data.playlists.items.map(item => ({
        name: item.name,
        id: item.id,
        images: item.images,
        tracks: item.tracks,
      }))
      this.setState({
        specificGenreDetailsData: updatedGenreDetailsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSpecificGenreDetails = () => {
    const {specificGenreDetailsData} = this.state
    return (
      <>
        <BackNavigation />
        <ul className="specific-genre-details-list">
          {specificGenreDetailsData.map(item => (
            <CategoryPlaylistItem categoryDetails={item} key={item.id} />
          ))}
        </ul>
      </>
    )
  }

  onTryAgain = () => {
    this.getSpecificGenreDetails()
  }

  renderFailureView = () => <FailureView onTryAgain={this.onTryAgain} />

  renderLoadingView = () => <LoaderView />

  renderApiStausView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSpecificGenreDetails()
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
      <div className="specific-genre-details-responsive-container">
        <div className="navbar-hide">
          <Navbar />
        </div>
        <div className="specific-genre-details-container">
          {this.renderApiStausView()}
        </div>
      </div>
    )
  }
}

export default CategoryPlaylists
