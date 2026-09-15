import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SuspectList from './SuspectList.jsx'

describe('SuspectList', () => {
  it('shows placement status and selects a character', () => {
    const onSelect = vi.fn()
    render(
      <SuspectList
        characters={[
          { id: 'victim', name: 'Doña Elvira' },
          { id: 's1', name: 'El mayordomo' },
        ]}
        positions={{ victim: { row: 0, col: 0 }, s1: null }}
        selectedCharacterId="s1"
        onSelect={onSelect}
      />,
    )

    expect(screen.getByText('Colocado')).toBeInTheDocument()
    expect(screen.getByText('Sin colocar')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /doña elvira/i }))
    expect(onSelect).toHaveBeenCalledWith('victim')
  })
})
