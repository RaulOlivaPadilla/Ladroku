import clsx from 'clsx'

const characterIcons = {
  victim: '💎',
  s1: '🧑‍💼',
  s2: '🧑‍🌾',
  s3: '🧑‍🍳',
  s4: '🎨',
}

function SuspectCard({ character, placed, selected, onSelect }) {
  return (
    <button
      className={clsx('suspect-card', placed && 'suspect-card--placed', selected && 'suspect-card--selected')}
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(character.id)}
    >
      <span className="suspect-card__avatar" aria-hidden="true">
        {characterIcons[character.id] ?? (character.isThief ? '🕵️' : '👤')}
      </span>
      <span>
        <strong>{character.name}</strong>
        <small>{placed ? 'Colocado' : 'Sin colocar'}</small>
      </span>
    </button>
  )
}

export default SuspectCard
