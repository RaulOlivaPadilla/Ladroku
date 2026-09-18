import GridCell from './GridCell.jsx'

function Grid({
  gridSize,
  rooms,
  characters,
  positions,
  clues = [],
  selectedCharacterId,
  invalidRoomId,
  onCellClick,
}) {
  const roomByPosition = new Map(rooms.map((room) => [`${room.row}-${room.col}`, room]))
  const orderedRooms = [...rooms].sort((first, second) => (
    first.row - second.row || first.col - second.col
  ))
  const characterByPosition = new Map(
    Object.entries(positions ?? {})
      .filter(([, position]) => position)
      .map(([characterId, position]) => [`${position.row}-${position.col}`, characterId]),
  )
  const charactersById = Object.fromEntries((characters ?? []).map((character) => [character.id, character]))
  const firstCellByRoom = new Map()
  const cellsByRoom = new Map()
  rooms.forEach((room) => {
    if (!cellsByRoom.has(room.roomId)) cellsByRoom.set(room.roomId, [])
    cellsByRoom.get(room.roomId).push(room)
    if (!firstCellByRoom.has(room.roomId)) {
      firstCellByRoom.set(room.roomId, room.id)
    }
  })
  const labelCellByRoom = new Map()
  cellsByRoom.forEach((roomCells, roomId) => {
    const cellKeys = new Set(roomCells.map((room) => `${room.row}-${room.col}`))
    const anchor = roomCells.reduce((best, room) => {
      let span = 0
      while (cellKeys.has(`${room.row}-${room.col + span}`)) span += 1
      const bestSpan = best
        ? (() => {
          let currentSpan = 0
          while (cellKeys.has(`${best.row}-${best.col + currentSpan}`)) currentSpan += 1
          return currentSpan
        })()
        : 0
      return span > bestSpan ? room : best
    }, null)
    labelCellByRoom.set(roomId, anchor?.id ?? firstCellByRoom.get(roomId))
  })
  const traitCellsByRoom = new Map()
  const hintedTraits = new Set(
    clues
      .filter((clue) => clue.type === 'roomHasTrait')
      .map((clue) => clue.trait),
  )
  cellsByRoom.forEach((roomCells, roomId) => {
    const roomTraits = roomCells[0].traits
    const hintedRoomTraits = roomTraits.filter((trait) => hintedTraits.has(trait))
    const visibleTraits = [...new Set([...hintedRoomTraits, ...roomTraits])]
      .slice(0, roomCells.length >= 8 ? 3 : roomCells.length >= 3 ? 2 : 1)
    if (!visibleTraits.length) return
    const iconCount = visibleTraits.length
    const indexes = iconCount === 2
      ? [Math.floor(roomCells.length * 0.3), Math.floor(roomCells.length * 0.7)]
      : iconCount === 3
        ? [Math.floor(roomCells.length * 0.2), Math.floor(roomCells.length * 0.5), Math.floor(roomCells.length * 0.8)]
        : [Math.floor(roomCells.length / 2)]
    traitCellsByRoom.set(roomId, new Map(
      indexes.map((index, iconIndex) => [roomCells[index].id, visibleTraits[iconIndex]]),
    ))
  })
  const labelSpanByRoom = new Map()
  rooms.forEach((room) => {
    if (labelCellByRoom.get(room.roomId) !== room.id) return
    let span = 1
    while (rooms.some((candidate) => (
      candidate.roomId === room.roomId
      && candidate.row === room.row
      && candidate.col === room.col + span
    ))) {
      span += 1
    }
    const displayNameLength = room.name.replace(/\s+[A-Z]$/, '').length
    labelSpanByRoom.set(room.roomId, Math.min(span, Math.max(1, Math.ceil(displayNameLength / 5))))
  })

  return (
    <div className="grid" role="grid" style={{ '--grid-size': gridSize }} aria-label="Tablero de juego">
      {orderedRooms.map((room) => {
        const characterId = characterByPosition.get(`${room.row}-${room.col}`)
        const neighborAt = (row, col) => roomByPosition.get(`${row}-${col}`)
        const sameRoom = (row, col) => neighborAt(row, col)?.roomId === room.roomId
        const isCurrentCharacterCell = characterId === selectedCharacterId
        const isBlockedByPlacedCharacter = Object.entries(positions ?? {}).some(
          ([placedId, position]) => placedId !== selectedCharacterId
            && position
            && (position.row === room.row || position.col === room.col),
        )
        const isBlocked = Boolean(selectedCharacterId)
          && !isCurrentCharacterCell
          && (Boolean(characterId) || isBlockedByPlacedCharacter)
        return (
          <GridCell
            key={room.id}
            room={room}
            character={characterId ? charactersById[characterId] : null}
            colorIndex={room.colorIndex}
            showRoomName={labelCellByRoom.get(room.roomId) === room.id}
            trait={traitCellsByRoom.get(room.roomId)?.get(room.id)}
            roomLabelSpan={labelSpanByRoom.get(room.roomId) ?? 1}
            selected={Boolean(selectedCharacterId)}
            disabled={isBlocked}
            invalid={room.id === invalidRoomId}
            joined={{
              top: sameRoom(room.row - 1, room.col),
              right: sameRoom(room.row, room.col + 1),
              bottom: sameRoom(room.row + 1, room.col),
              left: sameRoom(room.row, room.col - 1),
              hasTop: Boolean(neighborAt(room.row - 1, room.col)),
              hasRight: Boolean(neighborAt(room.row, room.col + 1)),
              hasBottom: Boolean(neighborAt(room.row + 1, room.col)),
              hasLeft: Boolean(neighborAt(room.row, room.col - 1)),
            }}
            onClick={onCellClick}
          />
        )
      })}
    </div>
  )
}

export default Grid
