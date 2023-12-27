import React from 'react';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import NotFound from '../app/not-found'

describe('NotFound', () => {
    test('renders 404 message', () => {
        render(<NotFound />)
        const headingElement = screen.getByText('404: NotFound')
        const paragraphElement = screen.getByText('ページが見つかりません。')
        expect(headingElement).toBeInTheDocument()
        expect(paragraphElement).toBeInTheDocument()
    })
})