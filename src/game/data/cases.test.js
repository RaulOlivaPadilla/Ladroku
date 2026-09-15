import { describe, expect, it } from 'vitest'
import case001 from './cases/case-001.json'
import case002 from './cases/case-002.json'

const cases = [case001, case002]

function hasUniqueCoordinates(positions) {
  const values = Object.values(positions)
  const rows = values.map(({ row }) => row)
  const columns = values.map(({ col }) => col)

  return new Set(rows).size === values.length && new Set(columns).size === values.length
}

describe('Ladroku case data', () => {
  it.each(cases)('$id follows the case model rules', (gameCase) => {
    const { gridSize, characters, rooms, solution } = gameCase
    const thiefCharacters = characters.filter((character) => character.isThief)
    const thiefPosition = solution.positions[solution.thiefId]
    const stolenRoom = rooms.find((room) => room.id === solution.stolenFromRoom)
    const roomCellCounts = rooms.reduce((counts, room) => {
      counts[room.name] = (counts[room.name] ?? 0) + 1
      return counts
    }, {})

    expect(characters).toHaveLength(gridSize)
    expect(rooms).toHaveLength(gridSize * gridSize)
    expect(Object.keys(roomCellCounts).length).toBeGreaterThanOrEqual(3)
    expect(Object.keys(roomCellCounts).length).toBeLessThanOrEqual(6)
    expect(Object.values(roomCellCounts).every((count) => count > 1)).toBe(true)
    expect(Object.keys(solution.positions)).toHaveLength(gridSize)
    expect(hasUniqueCoordinates(solution.positions)).toBe(true)
    expect(thiefCharacters).toHaveLength(1)
    expect(solution.thiefId).toBe(thiefCharacters[0].id)
    expect(stolenRoom).toMatchObject(thiefPosition)
  })
})
