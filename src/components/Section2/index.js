import {Component} from 'react'
import Cookies from 'js-cookie'
import Categories from '../Categories'
import FailureView from '../FailureView'
import LoaderView from '../LoaderView'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Section2 extends Component {
  state = {
    categoriesData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getCategoriesData()
  }

  getCategoriesData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const categoriesApiUrl = 'https://apis2.ccbp.in/spotify-clone/categories'

    const categoriesOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const categoriesResponse = await fetch(categoriesApiUrl, categoriesOptions)
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json()
      const updatedCategoriesData = categoriesData.categories.items.map(
        item => ({
          id: item.id,
          name: item.name,
          icons: item.icons,
        }),
      )
      this.setState({
        categoriesData: updatedCategoriesData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderGenresMoodsList = () => {
    const {categoriesData} = this.state
    return (
      <div className="genres-moods-container">
        <h1 className="genres-moods-heading">Genres & Moods</h1>
        <ul className="genres-moods-list">
          {categoriesData.map(item => (
            <Categories categoriesData={item} key={item.id} />
          ))}
        </ul>
      </div>
    )
  }

  onTryAgain = () => {
    this.getCategoriesData()
  }

  renderLoadingView = () => <LoaderView />

  renderFailureView = () => <FailureView onTryAgain={this.onTryAgain} />

  renderApiStatusView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderGenresMoodsList()
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

export default Section2
