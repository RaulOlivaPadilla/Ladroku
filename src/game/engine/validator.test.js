import { describe, expect, it } from 'vitest'
import { isBoardComplete, isValidPlacement, matchesSolution } from './validator.js'

describe('validator', () => {
  it('rejects a cell sharing a row or column', () => {
    const positions = { s1: { row: 1, col: 2 } }

    expect(isValidPlacement(positions, 's2', 1, 4)).toBe(false)
    expect(isValidPlacement(positions, 's2', 3, 2)).toBe(false)
    expect(isValidPlacement(positions, 's2', 3, 4)).toBe(true)
  })

  it('detects a complete board', () => {
    expect(isBoardComplete({
      victim: { row: 0, col: 0 },
      s1: { row: 1, col: 1 },
    }, 2)).toBe(true)
  })

  it('compares all positions with the solution', () => {
    const solution = { positions: { victim: { row: 0, col: 0 }, s1: { row: 1, col: 1 } } }
    expect(matchesSolution(solution.positions, solution)).toBe(true)
    expect(matchesSolution({ victim: { row: 0, col: 1 }, s1: { row: 1, col: 1 } }, solution)).toBe(false)
  })
})
