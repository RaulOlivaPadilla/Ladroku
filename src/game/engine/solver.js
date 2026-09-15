import { checkClue } from './clueGenerator.js'
import { isValidPlacement } from './validator.js'

/**
 * Finds every board satisfying the supplied clues. This intentionally keeps
 * the result list small enough for puzzle uniqueness checks.
 *
 * @param {Array<Object>} clues
 * @param {number} gridSize
 * @param {Array<string|{id: string}>} characters
 * @param {{ rooms?: Array<Object>, maxSolutions?: number }} [context]
 * @returns {Array<Record<string, { row: number, col: number }>>}
 */
export function solve(clues, gridSize, characters, context = {}) {
  const characterIds = characters.map((character) => (
    typeof character === 'string' ? character : character.id
  ))
  const solutions = []
  const positions = {}
  const maxSolutions = context.maxSolutions ?? Number.POSITIVE_INFINITY

  function backtrack(index) {
    if (solutions.length >= maxSolutions) return
    if (index === characterIds.length) {
      solutions.push(structuredClone(positions))
      return
    }

    const characterId = characterIds[index]
    for (let row = 0; row < gridSize; row += 1) {
      for (let col = 0; col < gridSize; col += 1) {
        if (!isValidPlacement(positions, characterId, row, col)) continue
        positions[characterId] = { row, col }
        if (clues.every((clue) => checkClue(positions, clue, context))) {
          backtrack(index + 1)
        }
        delete positions[characterId]
      }
    }
  }

  backtrack(0)
  return solutions
}

/** @returns {boolean} */
export function hasUniqueSolution(clues, gridSize, characters, context = {}) {
  return solve(clues, gridSize, characters, { ...context, maxSolutions: 2 }).length === 1
}
