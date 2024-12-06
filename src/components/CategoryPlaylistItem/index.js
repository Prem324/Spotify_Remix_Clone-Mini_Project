import {Link} from 'react-router-dom'
import './index.css'

const CategoryPlaylistItem = props => {
  const {categoryDetails} = props
  const {id, name, images, tracks} = categoryDetails
  const imageUrl = images[0]
  return (
    <div className="category-item">
      <Link className="link-item" to={`/playlist/${id}`}>
        <img
          className="category-item-image"
          src={imageUrl.url}
          alt="category"
        />
        <div className="category-content">
          <p className="category-item-name">{name}</p>
          <p className="category-item-tracks-count">{`${tracks.total} Tracks`}</p>
        </div>
      </Link>
    </div>
  )
}

export default CategoryPlaylistItem
