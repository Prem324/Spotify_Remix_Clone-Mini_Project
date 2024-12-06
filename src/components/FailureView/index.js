import './index.css'

const FailureView = props => {
  const {onTryAgain} = props
  const onClickTryAgain = () => {
    onTryAgain()
  }

  return (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dlakv8a0n/image/upload/v1729584589/SpotifyRemix/alert-triangle.png"
        alt="failure view"
        className="failure-view-icon"
      />
      <p className="failure-view-description">
        Something went wrong. Please try again
      </p>
      <button
        className="try-again-button"
        type="button"
        onClick={onClickTryAgain}
      >
        Try again
      </button>
    </div>
  )
}
export default FailureView
