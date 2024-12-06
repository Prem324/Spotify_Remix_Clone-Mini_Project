import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {IoMdLogOut} from 'react-icons/io'

import './index.css'

const Navbar = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <>
      <div className="navbar-mobile-container">
        <Link to="/">
          <img
            className="navbar-mobile-logo"
            src="https://res.cloudinary.com/dlakv8a0n/image/upload/v1729151434/SpotifyRemix/music-icon-4x.png"
            alt="navbar"
          />
        </Link>
        <button type="button" className="menu-button" onClick={onLogout}>
          <IoMdLogOut className="menu-icon-mobile" />
        </button>
      </div>

      <div className="navbar-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dlakv8a0n/image/upload/v1729151434/SpotifyRemix/music-icon-4x.png"
            alt="website logo"
            className="navbar-logo"
          />
        </Link>
        <button className="logout-button" type="button" onClick={onLogout}>
          <IoMdLogOut className="logout-icon" />
          Logout
        </button>
      </div>
    </>
  )
}

export default withRouter(Navbar)
