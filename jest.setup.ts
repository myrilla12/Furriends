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
jest.mock('@/utils/supabase/component', () => {
    return {
        createClient: jest.fn(() => ({
            auth: {
                signInWithPassword: jest.fn(),
            },
            from: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        single: jest.fn(),
                    }),
                }),
                update: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({}),
                }),
            }),
        })),
    };
});

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
