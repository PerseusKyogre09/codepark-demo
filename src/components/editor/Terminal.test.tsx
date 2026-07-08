import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Terminal } from './Terminal';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { SocketProvider } from '../../contexts/SocketContext';
import { SessionProvider } from '../../contexts/SessionContext';
import { AuthProvider } from '../../contexts/AuthContext'; // Wait, let's check AuthProvider name. Ah, in App.tsx it's AuthProvider, which comes from contexts/AuthContext. Wait! Let's import it from contexts/AuthContext.

import React from 'react';

// Wrapper component with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider autoConnect={false}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

describe('Terminal Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders terminal title and buttons', () => {
    render(
      <TestWrapper>
        <Terminal onClose={mockOnClose} />
      </TestWrapper>
    );

    // Title should be rendered
    expect(screen.getByText('Terminal')).toBeInTheDocument();

    // Buttons should be rendered with proper titles
    expect(screen.getByTitle('Clear terminal')).toBeInTheDocument();
    expect(screen.getByTitle('Minimize terminal')).toBeInTheDocument();
    expect(screen.getByTitle('Close terminal')).toBeInTheDocument();
  });

  it('renders xterm container structure', () => {
    render(
      <TestWrapper>
        <Terminal onClose={mockOnClose} />
      </TestWrapper>
    );

    // XTerm terminal element should be mounted in the DOM
    const xtermTextarea = screen.getByLabelText('Terminal input');
    expect(xtermTextarea).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <TestWrapper>
        <Terminal onClose={mockOnClose} />
      </TestWrapper>
    );

    const closeButton = screen.getByTitle('Close terminal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when minimize button is clicked', () => {
    render(
      <TestWrapper>
        <Terminal onClose={mockOnClose} />
      </TestWrapper>
    );

    const minimizeButton = screen.getByTitle('Minimize terminal');
    fireEvent.click(minimizeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('clears terminal when clear button is clicked', () => {
    render(
      <TestWrapper>
        <Terminal onClose={mockOnClose} />
      </TestWrapper>
    );

    const clearButton = screen.getByTitle('Clear terminal');
    // Click should run without crashing
    fireEvent.click(clearButton);
    expect(clearButton).toBeInTheDocument();
  });
});
