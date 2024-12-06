import {Link} from 'react-router-dom'
import './index.css'

const NewReleases = props => {
  const {newReleasesData} = props
  const {id, name, images} = newReleasesData

  const image = images[0]

  return (
    <li className="new-releases-item">
      <Link className="link-item" to={`/album/${id}`}>
        <div className="new-releases-content">
          <img
            className="new-releases-item-image"
            src={image.url}
            alt="new release album"
          />
          <p className="new-releases-item-name">{name}</p>
        </div>
      </Link>
    </li>
  )
}

export default NewReleases
