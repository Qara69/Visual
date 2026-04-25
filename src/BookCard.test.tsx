import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookCard from './BookCard';

describe('BookCard', () => {
  it('отображает название книги', () => {
    render(
      <BookCard 
        title="Война и мир" 
        authors={['Лев Толстой']} 
        coverBlob={null} 
      />
    );
    
    expect(screen.getByText('Война и мир')).toBeDefined();
  });
});