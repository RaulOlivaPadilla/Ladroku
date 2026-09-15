import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AccusationModal from './AccusationModal.jsx'

describe('AccusationModal', () => {
  it('submits the selected accusation', () => {
    const onSubmit = vi.fn()
    render(
      <AccusationModal
        open
        characters={[{ id: 's1', name: 'Mayordomo' }, { id: 'victim', name: 'Víctima' }]}
        objects={[{ id: 'collar', name: 'Collar' }]}
        rooms={[{ id: 'room-0-0', row: 0, col: 0, name: 'Cocina' }]}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    )

    fireEvent.change(screen.getByLabelText('Ladrón'), { target: { value: 's1' } })
    fireEvent.change(screen.getByLabelText('Objeto robado'), { target: { value: 'collar' } })
    fireEvent.change(screen.getByLabelText('Habitación'), { target: { value: 'room-0-0' } })
    fireEvent.click(screen.getByRole('button', { name: 'Acusar' }))
    expect(onSubmit).toHaveBeenCalledWith({ suspectId: 's1', objectId: 'collar', roomId: 'room-0-0' })
  })
})
