import GridCell from './GridCell.jsx'

function Grid({ gridSize, rooms, characters, positions, selectedCharacterId, invalidRoomId, onCellClick }) {
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
        return (
          <GridCell
            key={room.id}
            room={room}
            character={characterId ? charactersById[characterId] : null}
            selected={Boolean(selectedCharacterId)}
            invalid={room.id === invalidRoomId}
            onClick={onCellClick}
          />
        )
      })}
    </div>
  )
}

export default Grid
