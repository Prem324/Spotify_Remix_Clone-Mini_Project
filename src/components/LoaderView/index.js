import './index.css'

const LoaderView = () => (
  <div data-testid="loader" className="loading-view-container">
    <img
      src="https://res.cloudinary.com/dlakv8a0n/image/upload/v1729151434/SpotifyRemix/music-icon-4x.png"
      alt="website logo"
      className="loading-view-image"
    />
    <h1 className="loading-view-text">Loading...</h1>
  </div>
)

export default LoaderView
