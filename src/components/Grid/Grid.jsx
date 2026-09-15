import GridCell from './GridCell.jsx'

function Grid({ gridSize, rooms, characters, positions, selectedCharacterId, invalidRoomId, onCellClick }) {
  const roomByPosition = new Map(rooms.map((room) => [`${room.row}-${room.col}`, room]))
  const characterByPosition = new Map(
    Object.entries(positions ?? {})
      .filter(([, position]) => position)
      .map(([characterId, position]) => [`${position.row}-${position.col}`, characterId]),
  )
  const charactersById = Object.fromEntries((characters ?? []).map((character) => [character.id, character]))

  return (
    <div className="grid" role="grid" style={{ '--grid-size': gridSize }} aria-label="Tablero de juego">
      {rooms.map((room) => {
        const characterId = characterByPosition.get(`${room.row}-${room.col}`)
        const sameRoom = (row, col) => roomByPosition.get(`${row}-${col}`)?.roomId === room.roomId
        return (
          <GridCell
            key={room.id}
            room={room}
            character={characterId ? charactersById[characterId] : null}
            selected={Boolean(selectedCharacterId)}
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
