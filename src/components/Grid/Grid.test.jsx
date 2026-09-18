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

  it('renders SVG assets only for traits with a matching asset', () => {
    render(
      <Grid
        gridSize={9}
        rooms={[
          { id: 'barriles', roomId: 'room-a', row: 0, col: 0, name: 'Bodega', traits: ['barriles'] },
          { id: 'cuadros', roomId: 'room-b', row: 0, col: 1, name: 'Galería', traits: ['cuadros'] },
          { id: 'escritorio', roomId: 'room-c', row: 0, col: 2, name: 'Despacho', traits: ['escritorio'] },
          { id: 'estanterias', roomId: 'room-d', row: 0, col: 3, name: 'Biblioteca', traits: ['estanterías'] },
          { id: 'fogon', roomId: 'room-e', row: 0, col: 4, name: 'Cocina', traits: ['fogón'] },
          { id: 'mesa', roomId: 'room-f', row: 0, col: 5, name: 'Comedor', traits: ['mesa larga'] },
          { id: 'plantas', roomId: 'room-g', row: 0, col: 6, name: 'Invernadero', traits: ['plantas'] },
          { id: 'sofa', roomId: 'room-h', row: 0, col: 7, name: 'Salón', traits: ['sofá'] },
          { id: 'chimenea', roomId: 'room-i', row: 0, col: 8, name: 'Salón', traits: ['chimenea'] },
        ]}
        characters={[]}
        positions={{}}
        onCellClick={vi.fn()}
      />,
    )

    expect(screen.getAllByRole('img')).toHaveLength(8)
    expect(screen.getByTitle('chimenea').querySelector('img')).toBeNull()
    expect(screen.getByTitle('barriles').querySelector('img')).toHaveAttribute(
      'src',
      '/game-assets/objetos-decoracion/objetos/barriles.svg',
    )
  })
})
