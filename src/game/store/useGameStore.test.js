import { beforeEach, describe, expect, it } from 'vitest'
import case001 from '../data/cases/case-001.json'
import { useGameStore } from './useGameStore.js'

const getState = () => useGameStore.getState()

describe('useGameStore', () => {
  beforeEach(() => {
    useGameStore.setState({
      currentCase: null,
      playerPositions: {},
      selectedCharacterId: null,
      revealedClues: [],
      accusation: { suspectId: null, objectId: null, roomId: null },
      status: 'playing',
      mistakesCount: 0,
      timerSeconds: 0,
    })
  })

  it('loads a case with every character unplaced', () => {
    getState().loadCase(case001)

    expect(getState().currentCase.id).toBe('case-001')
    expect(getState().playerPositions).toEqual({
      victim: null,
      s1: null,
      s2: null,
      s3: null,
      s4: null,
    })
  })

  it('places valid characters and rejects a shared row or column', () => {
    getState().loadCase(case001)

    expect(getState().placeCharacter('victim', 0, 0)).toBe(true)
    expect(getState().placeCharacter('s1', 0, 1)).toBe(false)
    expect(getState().placeCharacter('s1', 1, 1)).toBe(true)
    expect(getState().removeCharacter('s1')).toBe(true)
    expect(getState().playerPositions.s1).toBeNull()
  })

  it('reveals clues in order and completes a correct accusation', () => {
    getState().loadCase(case001)
    expect(getState().revealNextClue().id).toBe('c1')
    expect(getState().revealNextClue().id).toBe('c2')

    Object.entries(case001.solution.positions).forEach(([characterId, position]) => {
      expect(getState().placeCharacter(characterId, position.row, position.col)).toBe(true)
    })
    expect(getState().isBoardComplete()).toBe(true)
    expect(getState().submitAccusation({
      suspectId: 's1',
      objectId: 'collar',
      roomId: 'room-1-1',
    })).toBe(true)
    expect(getState().status).toBe('won')
  })

  it('counts incorrect accusations and allows retrying', () => {
    getState().loadCase(case001)

    expect(getState().submitAccusation({
      suspectId: 's2',
      objectId: 'collar',
      roomId: 'room-1-1',
    })).toBe(false)
    expect(getState().mistakesCount).toBe(1)
    expect(getState().status).toBe('playing')
  })

  it('increments the timer only while playing and resets the case', () => {
    getState().loadCase(case001)
    getState().incrementTimer()
    getState().incrementTimer()
    expect(getState().timerSeconds).toBe(2)

    getState().submitAccusation({ suspectId: 's2', objectId: 'x', roomId: 'x' })
    getState().resetCase()
    expect(getState().timerSeconds).toBe(0)
    expect(getState().mistakesCount).toBe(0)
    expect(getState().currentCase.id).toBe('case-001')
  })
})
