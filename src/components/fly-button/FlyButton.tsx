import './FlyButton.css'
import flyImage from '../../assets/fly.png'

type FlyButtonProps = {
  active: boolean
  onClick: () => void
}

export function FlyButton({ active, onClick }: FlyButtonProps) {
  return (
    <button
      type="button"
      className="fly-button"
      aria-label="Release the flies"
      aria-pressed={active}
      onClick={onClick}
    >
      <img src={flyImage} alt="" />
    </button>
  )
}
