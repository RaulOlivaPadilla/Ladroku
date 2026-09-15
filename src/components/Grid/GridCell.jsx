import clsx from 'clsx'

function GridCell({ room, character, selected, invalid, onClick }) {
  return (
    <button
      className={clsx('grid-cell', selected && 'grid-cell--selected', invalid && 'grid-cell--invalid')}
      type="button"
      role="gridcell"
      aria-label={`${room.name}, fila ${room.row + 1}, columna ${room.col + 1}`}
      onClick={() => onClick(room)}
    >
      <span className="grid-cell__room">{room.name}</span>
      <span className="grid-cell__traits">{room.traits.join(' · ')}</span>
      {character && <span className="grid-cell__character">{character.name}</span>}
    </button>
  )
}

export default GridCell
