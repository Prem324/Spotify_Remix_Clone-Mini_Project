import {Link} from 'react-router-dom'

import './index.css'

const FeaturedPlaylist = props => {
  const {featuredPlaylistsData} = props
  const {id, name, images} = featuredPlaylistsData

  const imageUrl = images[0]

  return (
    <li className="editors-picks-item">
      <Link className="link-item" to={`/playlist/${id}`}>
        <div className="editors-picks-content">
          <img
            className="editors-picks-item-image"
            src={imageUrl.url}
            alt="featured playlists"
          />
          <p className="editors-picks-item-name">{name}</p>
        </div>
      </Link>
    </li>
  )
}

export default FeaturedPlaylist
