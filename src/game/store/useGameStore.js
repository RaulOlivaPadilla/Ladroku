import { create } from 'zustand'
import {
  isBoardComplete,
  isValidPlacement,
  matchesSolution,
} from '../engine/validator.js'

const initialAccusation = {
  suspectId: null,
  objectId: null,
  roomId: null,
}

const createInitialState = () => ({
  currentCase: null,
  playerPositions: {},
  selectedCharacterId: null,
  revealedClues: [],
  accusation: { ...initialAccusation },
  status: 'playing',
  mistakesCount: 0,
  timerSeconds: 0,
})

export const useGameStore = create((set, get) => ({
  ...createInitialState(),

  loadCase: (caseData) => {
    if (!caseData?.id || !Array.isArray(caseData.characters)) {
      throw new Error('Invalid case data')
    }

    set({
      ...createInitialState(),
      currentCase: caseData,
      playerPositions: Object.fromEntries(
        caseData.characters.map((character) => [character.id, null]),
      ),
    })
  },

  selectCharacter: (characterId) => {
    const { currentCase } = get()
    if (!currentCase?.characters.some(({ id }) => id === characterId)) return
    set({ selectedCharacterId: characterId })
  },

  placeCharacter: (characterId, row, col) => {
    const { currentCase, playerPositions, status } = get()
    if (status !== 'playing' || !currentCase) return false
    if (!currentCase.characters.some(({ id }) => id === characterId)) return false
    if (!Number.isInteger(row) || !Number.isInteger(col)) return false
    if (row < 0 || row >= currentCase.gridSize || col < 0 || col >= currentCase.gridSize) {
      return false
    }

    const positions = Object.fromEntries(
      Object.entries(playerPositions).filter(([, position]) => position),
    )
    if (!isValidPlacement(positions, characterId, row, col)) return false

    set({
      playerPositions: { ...playerPositions, [characterId]: { row, col } },
      selectedCharacterId: null,
    })
    return true
  },

  removeCharacter: (characterId) => {
    const { playerPositions } = get()
    if (!(characterId in playerPositions)) return false
    set({
      playerPositions: { ...playerPositions, [characterId]: null },
      selectedCharacterId: null,
    })
    return true
  },

  revealNextClue: () => {
    const { currentCase, revealedClues } = get()
    const nextClue = currentCase?.clues?.find(
      ({ id }) => !revealedClues.includes(id),
    )
    if (!nextClue) return null
    set({ revealedClues: [...revealedClues, nextClue.id] })
    return nextClue
  },

  submitAccusation: (accusation) => {
    const { currentCase, playerPositions, status } = get()
    if (status !== 'playing' || !currentCase) return false

    const normalizedAccusation = {
      suspectId: accusation?.suspectId ?? null,
      objectId: accusation?.objectId ?? null,
      roomId: accusation?.roomId ?? null,
    }
    const solution = currentCase.solution
    const isCorrect = matchesSolution(playerPositions, solution)
      && normalizedAccusation.suspectId === solution.thiefId
      && normalizedAccusation.objectId === currentCase.stolenItem.id
      && normalizedAccusation.roomId === solution.stolenFromRoom

    set({
      accusation: normalizedAccusation,
      status: isCorrect ? 'won' : 'playing',
      mistakesCount: isCorrect ? get().mistakesCount : get().mistakesCount + 1,
    })
    return isCorrect
  },

  incrementTimer: () => {
    if (get().status === 'playing') {
      set((state) => ({ timerSeconds: state.timerSeconds + 1 }))
    }
  },

  resetCase: () => {
    const { currentCase } = get()
    if (!currentCase) return
    get().loadCase(currentCase)
  },

  isBoardComplete: () => {
    const { currentCase, playerPositions } = get()
    return Boolean(
      currentCase
      && isBoardComplete(playerPositions, currentCase.characters.length),
    )
  },
}))
