import clsx from 'clsx'

const traitIcons = {
  alfombra: '🟫',
  'caja fuerte': '🗄️',
  escalera: '🪜',
  chimenea: '🔥',
  'luz tenue': '🕯️',
  piano: '🎹',
  árbol: '🌳',
  árboles: '🌳',
  ventana: '🪟',
  espejo: '🪞',
}

const traitAssets = {
  barriles: '/game-assets/objetos-decoracion/objetos/barriles.svg',
  cuadros: '/game-assets/objetos-decoracion/objetos/cuadro.svg',
  escritorio: '/game-assets/objetos-decoracion/objetos/silla.svg',
  estanterías: '/game-assets/objetos-decoracion/objetos/estanteria.svg',
  fogón: '/game-assets/objetos-decoracion/objetos/fogon.svg',
  'mesa larga': '/game-assets/objetos-decoracion/objetos/mesa.svg',
  plantas: '/game-assets/objetos-decoracion/objetos/planta.svg',
  sofá: '/game-assets/objetos-decoracion/objetos/sofa.svg',
}

function GridCell({
  room,
  character,
  colorIndex,
  selected,
  disabled,
  invalid,
  joined,
  showRoomName,
  trait,
  roomLabelSpan,
  onClick,
}) {
  const displayName = room.name.replace(/\s+[A-Z]$/, '')
  const roomClass = displayName
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
        colorIndex != null && `grid-cell--palette-${colorIndex}`,
        joined?.hasTop && !joined.top && 'grid-cell--border-top',
        joined?.hasRight && !joined.right && 'grid-cell--border-right',
        joined?.hasBottom && !joined.bottom && 'grid-cell--border-bottom',
        joined?.hasLeft && !joined.left && 'grid-cell--border-left',
        selected && 'grid-cell--selected',
        disabled && 'grid-cell--disabled',
        invalid && 'grid-cell--invalid',
        joined?.top && 'grid-cell--joined-top',
        joined?.right && 'grid-cell--joined-right',
        joined?.bottom && 'grid-cell--joined-bottom',
        joined?.left && 'grid-cell--joined-left',
      )}
      type="button"
      role="gridcell"
      aria-label={`${displayName}, fila ${room.row + 1}, columna ${room.col + 1}`}
      aria-disabled={disabled}
      aria-invalid={invalid}
      disabled={disabled}
      onClick={() => onClick(room)}
    >
      {showRoomName && (
        <span
          className="grid-cell__room"
          style={{ '--room-label-span': roomLabelSpan }}
        >
          {displayName}
        </span>
      )}
      <span className="grid-cell__traits" aria-label={`Objetos: ${room.traits.join(', ')}`}>
        {trait && (
          <span title={trait} aria-label={trait}>
            {traitAssets[trait] ? <img src={traitAssets[trait]} alt="" /> : traitIcons[trait] ?? '•'}
          </span>
        )}
      </span>
      {character && <span className="grid-cell__character">{character.name}</span>}
    </button>
  )
}

export default GridCell
