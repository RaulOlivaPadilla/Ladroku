import GridCell from './GridCell.jsx'

function Grid({ gridSize, rooms, characters, positions, selectedCharacterId, invalidRoomId, onCellClick }) {
  const roomByPosition = new Map(rooms.map((room) => [`${room.row}-${room.col}`, room]))
  const characterByPosition = new Map(
    Object.entries(positions ?? {})
      .filter(([, position]) => position)
      .map(([characterId, position]) => [`${position.row}-${position.col}`, characterId]),
  )
  const charactersById = Object.fromEntries((characters ?? []).map((character) => [character.id, character]))
  const firstCellByRoom = new Map()
  rooms.forEach((room) => {
    if (!firstCellByRoom.has(room.roomId)) {
      firstCellByRoom.set(room.roomId, room.id)
    }
  })
  const labelSpanByRoom = new Map()
  rooms.forEach((room) => {
    if (firstCellByRoom.get(room.roomId) !== room.id) return
    let span = 1
    while (rooms.some((candidate) => (
      candidate.roomId === room.roomId
      && candidate.row === room.row
      && candidate.col === room.col + span
    ))) {
      span += 1
    }
    labelSpanByRoom.set(room.roomId, Math.min(span, Math.max(1, Math.ceil(room.name.length / 8))))
  })

  return (
    <div className="grid" role="grid" style={{ '--grid-size': gridSize }} aria-label="Tablero de juego">
      {rooms.map((room) => {
        const characterId = characterByPosition.get(`${room.row}-${room.col}`)
        const sameRoom = (row, col) => roomByPosition.get(`${row}-${col}`)?.roomId === room.roomId
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
            showRoomName={firstCellByRoom.get(room.roomId) === room.id}
            roomLabelSpan={labelSpanByRoom.get(room.roomId) ?? 1}
            selected={Boolean(selectedCharacterId)}
            disabled={isBlocked}
            invalid={room.id === invalidRoomId}
            joined={{
              top: sameRoom(room.row - 1, room.col),
              right: sameRoom(room.row, room.col + 1),
              bottom: sameRoom(room.row + 1, room.col),
              left: sameRoom(room.row, room.col - 1),
            }}
            onClick={onCellClick}
          />
        )
      })}
    </div>
  )
}

export default Grid
