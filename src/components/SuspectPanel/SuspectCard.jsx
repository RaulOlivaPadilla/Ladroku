import clsx from 'clsx'

function SuspectCard({ character, placed, selected, onSelect }) {
  return (
    <button
      className={clsx('suspect-card', placed && 'suspect-card--placed', selected && 'suspect-card--selected')}
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(character.id)}
    >
      <span className="suspect-card__avatar" aria-hidden="true">{character.isThief ? '★' : '•'}</span>
      <span>
        <strong>{character.name}</strong>
        <small>{placed ? 'Colocado' : 'Sin colocar'}</small>
      </span>
    </button>
  )
}

export default SuspectCard
