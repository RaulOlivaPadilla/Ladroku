import clsx from 'clsx'

function GridCell({ room, character, selected, invalid, joined, onClick }) {
  const roomClass = room.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')

  return (
    <button
      className={clsx(
        'grid-cell',
        `grid-cell--room-${roomClass}`,
        selected && 'grid-cell--selected',
        invalid && 'grid-cell--invalid',
        joined?.top && 'grid-cell--joined-top',
        joined?.right && 'grid-cell--joined-right',
        joined?.bottom && 'grid-cell--joined-bottom',
        joined?.left && 'grid-cell--joined-left',
      )}
      type="button"
      role="gridcell"
      aria-label={`${room.name}, fila ${room.row + 1}, columna ${room.col + 1}`}
      aria-invalid={invalid}
      onClick={() => onClick(room)}
    >
      <span className="grid-cell__room">{room.name}</span>
      <span className="grid-cell__traits">{room.traits.join(' · ')}</span>
      {character && <span className="grid-cell__character">{character.name}</span>}
    </button>
  )
}

export default GridCell
