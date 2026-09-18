import { describe, expect, it } from 'vitest'
import case001 from './cases/case-001.json'
import case002 from './cases/case-002.json'
import { generatedCases } from './generatedCases.js'

const cases = [case001, case002, ...generatedCases]

function hasUniqueCoordinates(positions) {
  const values = Object.values(positions)
  const rows = values.map(({ row }) => row)
  const columns = values.map(({ col }) => col)

  return new Set(rows).size === values.length && new Set(columns).size === values.length
}

function hasConnectedCells(rooms, roomId) {
  const cells = rooms.filter((room) => room.roomId === roomId)
  const visited = new Set([`${cells[0].row}-${cells[0].col}`])
  const pending = [cells[0]]

  while (pending.length) {
    const current = pending.pop()
    rooms.forEach((room) => {
      const key = `${room.row}-${room.col}`
      const adjacent = Math.abs(room.row - current.row) + Math.abs(room.col - current.col) === 1
      if (room.roomId === roomId && adjacent && !visited.has(key)) {
        visited.add(key)
        pending.push(room)
      }
    })
  }

  return visited.size === cells.length
}

describe('Ladroku case data', () => {
  it.each(cases)('$id follows the case model rules', (gameCase) => {
    const { gridSize, characters, rooms, solution } = gameCase
    const thiefCharacters = characters.filter((character) => character.isThief)
    const thiefPosition = solution.positions[solution.thiefId]
    const stolenRoom = rooms.find((room) => room.id === solution.stolenFromRoom)
    const roomIds = [...new Set(rooms.map((room) => room.roomId))]
    const roomCellCounts = rooms.reduce((counts, room) => {
      counts[room.name] = (counts[room.name] ?? 0) + 1
      return counts
    }, {})
    const roomIdByName = rooms.reduce((roomNames, room) => {
      roomNames[room.name] ??= new Set()
      roomNames[room.name].add(room.roomId)
      return roomNames
    }, {})

    expect(characters).toHaveLength(gridSize)
    expect(rooms).toHaveLength(gridSize * gridSize)
    expect(Object.keys(roomCellCounts).length).toBeGreaterThanOrEqual(3)
    expect(Object.values(roomCellCounts).every((count) => count > 1)).toBe(true)
    expect(Object.values(roomIdByName).every((ids) => ids.size === 1)).toBe(true)
    expect(roomIds.every((roomId) => hasConnectedCells(rooms, roomId))).toBe(true)
    expect(Object.keys(solution.positions)).toHaveLength(gridSize)
    expect(hasUniqueCoordinates(solution.positions)).toBe(true)
    expect(thiefCharacters).toHaveLength(1)
    expect(solution.thiefId).toBe(thiefCharacters[0].id)
    expect(stolenRoom).toMatchObject(thiefPosition)
  })
})
