import { describe, expect, it } from 'vitest'
import { checkClue } from './clueGenerator.js'

const positions = {
  a: { row: 0, col: 0 },
  b: { row: 0, col: 2 },
  c: { row: 1, col: 1 },
}
const rooms = [
  { row: 0, col: 0, traits: ['ventana'] },
  { row: 0, col: 2, traits: ['chimenea'] },
  { row: 1, col: 1, traits: ['alfombra'] },
]

describe('clueGenerator checks', () => {
  it.each([
    ['sameRow', { subjects: ['a', 'b'] }, true],
    ['notSameRow', { subjects: ['a', 'c'] }, true],
    ['sameCol', { subjects: ['b', 'c'] }, false],
    ['notSameCol', { subjects: ['a', 'b'] }, true],
    ['adjacentTo', { subjects: ['a', 'c'] }, false],
    ['rowRange', { subject: 'c', min: 1, max: 1 }, true],
    ['colRange', { subject: 'b', min: 0, max: 1 }, false],
    ['exactPosition', { subject: 'a', row: 0, col: 0 }, true],
  ])('checks %s', (type, values, expected) => {
    expect(checkClue(positions, { type, ...values }, { rooms })).toBe(expected)
  })

  it('checks room traits', () => {
    expect(checkClue(positions, {
      type: 'roomHasTrait',
      subject: 'b',
      trait: 'chimenea',
    }, { rooms })).toBe(true)
    expect(checkClue(positions, {
      type: 'roomHasTrait',
      subject: 'b',
      trait: 'ventana',
    }, { rooms })).toBe(false)
  })

  it('throws for an unsupported clue type', () => {
    expect(() => checkClue({}, { type: 'unknown' })).toThrow('Unsupported clue type')
  })
})
