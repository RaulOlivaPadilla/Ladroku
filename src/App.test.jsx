import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('App', () => {
  it('renders the Ladroku starting screen', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Ladroku' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /comenzar caso/i }),
    ).toBeDisabled()
  })
})
