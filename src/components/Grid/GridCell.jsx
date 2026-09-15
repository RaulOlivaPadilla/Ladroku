import clsx from 'clsx'

const traitIcons = {
  alfombra: '🧶',
  barriles: '🛢️',
  'caja fuerte': '🔐',
  cuadros: '🖼️',
  escritorio: '🪑',
  escalera: '🪜',
  estanterías: '📚',
  fogón: '🔥',
  chimenea: '🔥',
  'luz tenue': '🕯️',
  mesa: '🍽️',
  'mesa larga': '🍽️',
  piano: '🎹',
  plantas: '🪴',
  ventana: '🪟',
  espejo: '🪞',
}

function getVisibleTraits(room) {
  return room.traits.filter((_, index) => (room.row + room.col + index) % 3 === 0)
}

function GridCell({ room, character, selected, invalid, joined, showRoomName, onClick }) {
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
        `grid-cell--region-${room.roomId}`,
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
      {showRoomName && <span className="grid-cell__room">{room.name}</span>}
      <span className="grid-cell__traits" aria-label={`Objetos: ${room.traits.join(', ')}`}>
        {getVisibleTraits(room).map((trait) => (
          <span key={trait} title={trait} aria-label={trait}>
            {traitIcons[trait] ?? '•'}
          </span>
        ))}
      </span>
      {character && <span className="grid-cell__character">{character.name}</span>}
    </button>
  )
}

export default GridCell
