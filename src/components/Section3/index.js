import {Component} from 'react'
import Cookies from 'js-cookie'
import NewReleases from '../NewReleases'
import FailureView from '../FailureView'
import LoaderView from '../LoaderView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Section3 extends Component {
  state = {
    newReleasesData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getNewReleasesData()
  }

  getNewReleasesData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const newReleasesApiUrl = 'https://apis2.ccbp.in/spotify-clone/new-releases'
    const newReleasesOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const newReleasesResponse = await fetch(
      newReleasesApiUrl,
      newReleasesOptions,
    )
    if (newReleasesResponse.ok) {
      const newReleasesData = await newReleasesResponse.json()
      const updatedAlbumsData = newReleasesData.albums.items.map(item => ({
        id: item.id,
        name: item.name,
        images: item.images,
      }))
      this.setState({
        newReleasesData: updatedAlbumsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderNewReleasesList = () => {
    const {newReleasesData} = this.state
    return (
      <div className="new-releases-container">
        <h1 className="new-releases-heading">New Releases</h1>
        <ul className="new-releases-list">
          {newReleasesData.map(item => (
            <NewReleases newReleasesData={item} key={item.id} />
          ))}
        </ul>
      </div>
    )
  }

  onTryAgain = () => {
    this.getNewReleasesData()
  }

  renderLoadingView = () => <LoaderView />

  renderFailureView = () => <FailureView onTryAgain={this.onTryAgain} />

  renderApiStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderNewReleasesList()
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

export default Section3
