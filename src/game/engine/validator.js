/**
 * @typedef {{ row: number, col: number }} Position
 */

/**
 * Checks whether a character can occupy a cell without sharing its row or
 * column with another placed character.
 *
 * @param {Record<string, Position>} positions
 * @param {string} characterId
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
export function isValidPlacement(positions, characterId, row, col) {
  return Object.entries(positions).every(([placedId, position]) => {
    if (placedId === characterId || !position) return true
    return position.row !== row && position.col !== col
  })
}

/**
 * @param {Record<string, Position>} positions
 * @param {number} totalCharacters
 * @returns {boolean}
 */
export function isBoardComplete(positions, totalCharacters) {
  const placedPositions = Object.values(positions).filter(Boolean)
  return placedPositions.length === totalCharacters
    && new Set(placedPositions.map(({ row }) => row)).size === totalCharacters
    && new Set(placedPositions.map(({ col }) => col)).size === totalCharacters
}

/**
 * @param {Record<string, Position>} positions
 * @param {{ positions: Record<string, Position> }} solution
 * @returns {boolean}
 */
export function matchesSolution(positions, solution) {
  const characterIds = Object.keys(solution.positions)
  return characterIds.length === Object.keys(positions).length
    && characterIds.every((characterId) => {
      const actual = positions[characterId]
      const expected = solution.positions[characterId]
      return actual?.row === expected.row && actual?.col === expected.col
    })
}
