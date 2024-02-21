import { render, screen } from '@testing-library/react'
import { it } from 'vitest'
import { App } from "../App.1"

it('should be able to render vite + react', () => {
    render(<App />)
    screen.getByText('Vite + React')
})