import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Grid from './Grid.jsx'

describe('Grid', () => {
  it('renders rooms and placed characters', () => {
    render(
      <Grid
        gridSize={2}
        rooms={[
          { id: 'room-0-0', row: 0, col: 0, name: 'Cocina', traits: ['ventana'] },
          { id: 'room-0-1', row: 0, col: 1, name: 'Salón', traits: ['chimenea'] },
          { id: 'room-1-0', row: 1, col: 0, name: 'Bodega', traits: ['barriles'] },
          { id: 'room-1-1', row: 1, col: 1, name: 'Despacho', traits: ['caja fuerte'] },
        ]}
        characters={[{ id: 's1', name: 'El mayordomo' }]}
        positions={{ s1: { row: 0, col: 0 } }}
        selectedCharacterId="s1"
        onCellClick={vi.fn()}
      />,
    )

    expect(screen.getByRole('grid', { name: 'Tablero de juego' })).toBeInTheDocument()
    expect(screen.getByText('El mayordomo')).toBeInTheDocument()
    expect(screen.getByText('Cocina')).toBeInTheDocument()
    expect(screen.getByTitle('ventana')).toBeInTheDocument()
    expect(screen.getByRole('gridcell', { name: /salón, fila 1, columna 2/i }))
      .toHaveAttribute('aria-label', 'Salón, fila 1, columna 2')
    expect(screen.getAllByRole('gridcell')).toHaveLength(4)
  })
})
