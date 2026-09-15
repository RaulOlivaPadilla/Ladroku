import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Toolbar from './Toolbar.jsx'

describe('Toolbar', () => {
  it('renders timer, errors and disabled accusation state', () => {
    render(
      <Toolbar
        seconds={65}
        mistakesCount={2}
        cases={[{ id: 'case-001', title: 'El collar' }]}
        currentCaseId="case-001"
        onCaseChange={vi.fn()}
        onReset={vi.fn()}
        onAccuse={vi.fn()}
        canAccuse={false}
      />,
    )

    expect(screen.getByLabelText('Tiempo de partida')).toHaveTextContent('01:05')
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Acusar' })).toBeDisabled()
  })
})
