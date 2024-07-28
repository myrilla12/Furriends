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

// Mocking window.matchMedia
window.matchMedia = window.matchMedia || function() {
    return {
      matches: false,
      addEventListener: jest.fn(), // Mock addEventListener
      removeEventListener: jest.fn(), // Mock removeEventListener
      dispatchEvent: jest.fn(), // Mock dispatchEvent
      addListener: jest.fn(), // For older browsers
      removeListener: jest.fn(), // For older browsers
    };
  };
