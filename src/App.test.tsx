import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Project Astra shell', () => {
  it('renders the Astra landing dashboard', () => {
    render(<App />)

    expect(screen.getByText(/project astra/i)).toBeInTheDocument()
    expect(screen.getByText(/astronaut training/i)).toBeInTheDocument()
    expect(screen.getByText(/mission control/i)).toBeInTheDocument()
  })
})
