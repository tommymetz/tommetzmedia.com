import './FlyButton.css'

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
      <span aria-hidden="true">!</span>
    </button>
  )
}
