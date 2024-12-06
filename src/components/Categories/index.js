import {Link} from 'react-router-dom'
import './index.css'

const Categories = props => {
  const {categoriesData} = props
  const {id, name, icons} = categoriesData

  const iconUrl = icons[0]
  return (
    <li className="genres-moods-item">
      <Link className="link-item" to={`category/${id}/playlists`}>
        <div className="genres-moods-content">
          <img
            className="genres-moods-item-image"
            src={iconUrl.url}
            alt="category"
          />
          <p className="genres-moods-item-name">{name}</p>
        </div>
      </Link>
    </li>
  )
}

export default Categories
