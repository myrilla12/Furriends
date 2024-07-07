import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import LoginBox from '@/components/login/loginBox';
import { createClient } from '@/utils/supabase/component';
import router from 'next/router';
import '@testing-library/jest-dom'


// Mock Supabase client
jest.mock('@/utils/supabase/component', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
    })),
  })),
}));

// Mock Next.js router
jest.mock('next/router', () => ({
  push: jest.fn(),
}));

describe('LoginBox Component', () => {
  it('renders the login form', () => {
    render(<LoginBox />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('updates the email and password state on input change', () => {
    render(<LoginBox />);

    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows an error message for invalid login', async () => {
    const mockSignInWithPassword = createClient().auth.signInWithPassword as jest.Mock;
    mockSignInWithPassword.mockResolvedValue({ data: null, error: new Error('Invalid credentials') });

    render(<LoginBox />);

    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password. Please try again./i)).toBeInTheDocument();
    });
  });

  it('redirects to the dashboard on successful login', async () => {
    const mockSignInWithPassword = createClient().auth.signInWithPassword as jest.Mock;
    const mockFrom = createClient().from as jest.Mock;

    mockSignInWithPassword.mockResolvedValue({ data: { user: { id: '123' } }, error: null });
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { username: 'existingUser' }, error: null, status: 200 }),
      update: jest.fn().mockReturnThis(),
    });

    render(<LoginBox />);

    const emailInput = screen.getByLabelText(/Email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement;
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
