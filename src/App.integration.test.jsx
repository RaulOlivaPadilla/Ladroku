import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'
import { useGameStore } from './game/store/useGameStore.js'

describe('Ladroku game flow', () => {
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

  it('loads the first case and completes a game through the UI', async () => {
    render(<App />)

    expect(await screen.findByText('El collar desaparecido', { selector: 'p' })).toBeInTheDocument()

    const characters = [
      ['Doña Elvira', 0],
      ['El mayordomo', 6],
      ['La jardinera', 12],
      ['El cocinero', 18],
      ['La restauradora', 24],
    ]
    characters.forEach(([character, cellIndex]) => {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(character, 'i') }))
      fireEvent.click(screen.getAllByRole('gridcell')[cellIndex])
    })

    fireEvent.click(screen.getByRole('button', { name: 'Acusar' }))
    fireEvent.change(screen.getByLabelText('Ladrón'), { target: { value: 's1' } })
    fireEvent.change(screen.getByLabelText('Objeto robado'), { target: { value: 'collar' } })
    fireEvent.change(screen.getByLabelText('Habitación'), { target: { value: 'room-1-1' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Acusar' }))

    await waitFor(() => {
      expect(screen.getByText('Caso resuelto')).toBeInTheDocument()
    })
    expect(screen.getByText('La solución')).toBeInTheDocument()
  })
})
