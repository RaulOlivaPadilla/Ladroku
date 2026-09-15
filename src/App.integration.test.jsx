import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'
import { useGameStore } from './game/store/useGameStore.js'

describe('Ladroku game flow', () => {
  beforeEach(() => {
    cleanup()
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

  function placeCharacters(characters) {
    characters.forEach(([character, cellIndex]) => {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(character, 'i') }))
      fireEvent.click(screen.getAllByRole('gridcell')[cellIndex])
    })
  }

  it('loads the first case and completes a game through the UI', async () => {
    render(<App />)

    expect(await screen.findByText('El collar desaparecido', { selector: 'p' })).toBeInTheDocument()

    placeCharacters([
      ['Doña Elvira', 0],
      ['El mayordomo', 6],
      ['La jardinera', 12],
      ['El cocinero', 18],
      ['La restauradora', 24],
    ])

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

  it('counts an incorrect accusation and permits a retry', async () => {
    render(<App />)
    await screen.findByText('El collar desaparecido', { selector: 'p' })
    placeCharacters([
      ['Doña Elvira', 0],
      ['El mayordomo', 6],
      ['La jardinera', 12],
      ['El cocinero', 18],
      ['La restauradora', 24],
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Acusar' }))
    fireEvent.change(screen.getByLabelText('Ladrón'), { target: { value: 's2' } })
    fireEvent.change(screen.getByLabelText('Objeto robado'), { target: { value: 'collar' } })
    fireEvent.change(screen.getByLabelText('Habitación'), { target: { value: 'room-1-1' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Acusar' }))

    expect(screen.getByText(/la acusación no es correcta/i)).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Acusar' })).toHaveLength(2)
  })

  it('changes case and resets the new board', async () => {
    render(<App />)
    await screen.findByText('El collar desaparecido', { selector: 'p' })

    fireEvent.change(screen.getByLabelText('Caso'), { target: { value: 'case-002' } })
    expect(await screen.findByText('El reloj de bolsillo', { selector: 'p' })).toBeInTheDocument()
    expect(screen.getByText('0/5 personajes')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /la jardinera/i }))
    fireEvent.click(screen.getAllByRole('gridcell')[12])
    expect(screen.getByText('1/5 personajes')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }))
    expect(screen.getByText('0/5 personajes')).toBeInTheDocument()
    expect(screen.getAllByText('Sin colocar')).toHaveLength(5)
  })

  it('solves the second case through the UI', async () => {
    render(<App />)
    await screen.findByText('El collar desaparecido', { selector: 'p' })
    fireEvent.change(screen.getByLabelText('Caso'), { target: { value: 'case-002' } })
    await screen.findByText('El reloj de bolsillo', { selector: 'p' })

    placeCharacters([
      ['Don Mateo', 4],
      ['El mayordomo', 8],
      ['La jardinera', 12],
      ['El cocinero', 16],
      ['La restauradora', 20],
    ])
    fireEvent.click(screen.getByRole('button', { name: 'Acusar' }))
    fireEvent.change(screen.getByLabelText('Ladrón'), { target: { value: 's3' } })
    fireEvent.change(screen.getByLabelText('Objeto robado'), { target: { value: 'reloj' } })
    fireEvent.change(screen.getByLabelText('Habitación'), { target: { value: 'room-3-1' } })
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Acusar' }))

    expect(await screen.findByText('Caso resuelto')).toBeInTheDocument()
    expect(screen.getByText('Reloj de bolsillo', { selector: 'strong' })).toBeInTheDocument()
  })

  it('shows feedback when placing a character in an occupied row', async () => {
    render(<App />)

    await screen.findAllByText('El collar desaparecido', { selector: 'p' })
    fireEvent.click(screen.getByRole('button', { name: /doña elvira/i }))
    fireEvent.click(screen.getAllByRole('gridcell')[0])
    fireEvent.click(screen.getByRole('button', { name: /el mayordomo/i }))
    const occupiedCell = screen.getAllByRole('gridcell')[0]
    fireEvent.click(occupiedCell)

    expect(occupiedCell).toHaveAttribute('aria-invalid', 'true')
  })
})
