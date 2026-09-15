import { describe, expect, it } from 'vitest'
import { hasUniqueSolution, solve } from './solver.js'

describe('solver', () => {
  it('finds the unique diagonal solution from exact positions', () => {
    const characters = ['a', 'b', 'c']
    const clues = characters.map((subject, index) => ({
      type: 'exactPosition',
      subject,
      row: index,
      col: index,
    }))

    expect(solve(clues, 3, characters)).toEqual([{
      a: { row: 0, col: 0 },
      b: { row: 1, col: 1 },
      c: { row: 2, col: 2 },
    }])
    expect(hasUniqueSolution(clues, 3, characters)).toBe(true)
  })

  it('stops counting after two solutions when uniqueness is impossible', () => {
    expect(solve([], 2, ['a', 'b'], { maxSolutions: 2 })).toHaveLength(2)
    expect(hasUniqueSolution([], 2, ['a', 'b'])).toBe(false)
  })
})
