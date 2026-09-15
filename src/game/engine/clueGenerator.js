/**
 * Returns the position of a subject, or null while solving a partial board.
 *
 * @param {Record<string, { row: number, col: number }>} positions
 * @param {string} subjectId
 */
function getPosition(positions, subjectId) {
  return positions[subjectId] ?? null
}

function checkPair(positions, clue, predicate) {
  const [first, second] = clue.subjects.map((id) => getPosition(positions, id))
  return first && second ? predicate(first, second) : true
}

const checks = {
  sameRow: (positions, clue) => checkPair(positions, clue, (first, second) => first.row === second.row),
  notSameRow: (positions, clue) => checkPair(positions, clue, (first, second) => first.row !== second.row),
  sameCol: (positions, clue) => checkPair(positions, clue, (first, second) => first.col === second.col),
  notSameCol: (positions, clue) => checkPair(positions, clue, (first, second) => first.col !== second.col),
  roomHasTrait: (positions, clue, context) => {
    const position = getPosition(positions, clue.subject)
    if (!position) return true
    const room = context?.rooms?.find(
      (candidate) => candidate.row === position.row && candidate.col === position.col,
    )
    return room?.traits.includes(clue.trait) ?? false
  },
  adjacentTo: (positions, clue) => checkPair(positions, clue, (first, second) => (
    Math.abs(first.row - second.row) + Math.abs(first.col - second.col) === 1
  )),
  rowRange: (positions, clue) => {
    const position = getPosition(positions, clue.subject)
    return !position || (position.row >= clue.min && position.row <= clue.max)
  },
  colRange: (positions, clue) => {
    const position = getPosition(positions, clue.subject)
    return !position || (position.col >= clue.min && position.col <= clue.max)
  },
  exactPosition: (positions, clue) => {
    const position = getPosition(positions, clue.subject)
    return !position || (position.row === clue.row && position.col === clue.col)
  },
}

/**
 * Checks a clue against a complete or partial board. Missing subjects are
 * treated as undecided so backtracking can prune only contradictions.
 *
 * @param {Record<string, { row: number, col: number }>} positions
 * @param {{ type: string }} clue
 * @param {{ rooms?: Array<{ row: number, col: number, traits: string[] }> }} [context]
 * @returns {boolean}
 */
export function checkClue(positions, clue, context = {}) {
  const check = checks[clue.type]
  if (!check) throw new Error(`Unsupported clue type: ${clue.type}`)
  return check(positions, clue, context)
}

/**
 * @param {Record<string, { row: number, col: number }>} positions
 * @param {Array<{ type: string }>} clues
 * @param {{ rooms?: Array<{ row: number, col: number, traits: string[] }> }} [context]
 */
export function satisfiesAllClues(positions, clues, context = {}) {
  return clues.every((clue) => checkClue(positions, clue, context))
}
