import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders the first Ladroku case', async () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Ladroku' })).toBeInTheDocument()
    expect(await screen.findByText('El collar desaparecido', { selector: 'p' })).toBeInTheDocument()
  })
})
