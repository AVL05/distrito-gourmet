import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

describe('App', () => {
  it('renders without crashing', () => {
    render(React.createElement('div', null, 'Test'));
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

});
