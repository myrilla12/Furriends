import { render, screen } from '@testing-library/react';
import Home from '@/pages';

// Mocking the useRouter hook
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mocking the Supabase client creation function
jest.mock('@/utils/supabase/component', () => ({
  createClient: jest.fn(() => ({
    auth: { onAuthStateChange: jest.fn() },
    from: jest.fn(() => ({
      select: jest.fn(),
    })),
  })),
}));

describe('Home Component', () => {
  it('displays the "Welcome to furriends!" text', () => {
    render(<Home />);
    
    // Check if the text "Welcome to furriends!" is present in the document
    const welcomeText = screen.getByText(/Welcome to/i);
    expect(welcomeText).not.toBeNull(); // Native assertion to check if element is found
  });
});
