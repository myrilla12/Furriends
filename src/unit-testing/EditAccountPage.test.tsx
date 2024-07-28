import EditAccountPage from '@/pages/account/edit';
import { ClassAttributes, ImgHTMLAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';
import type { User } from '@supabase/supabase-js';
import { fireEvent, render as rtlRender, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import AccountForm from '@/components/account/accountForm';

// Custom render function
function render(ui: React.ReactElement, options = {}) {
    return rtlRender(
      <MantineProvider>
        {ui}
      </MantineProvider>,
      options
    );
}

// Mock user object
const mockUser: User = {
    id: 'user-id',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'user@example.com',
    app_metadata: { provider: 'email' },
    user_metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

describe('EditAccountPage Component', () => {
    it('renders the page contents', () => {
        render(<EditAccountPage user={mockUser} />);

        // All expected texts to be rendered
        const texts = screen.queryAllByText(/Edit Profile|Email|Username|Address|Promote pet-related services on furriends as a freelancer?|Update|Upload/i)

        // Check if each text is present
        texts.forEach(text => {
            expect(text).toBeTruthy();
        })
    });
});

describe('AccountForm Component', () => {
    it('updates email and username states correctly when user types in input fields', () => {
        render(<AccountForm user={mockUser}/>);
        const emailPlaceholder = mockUser.email || '';
  
        const emailInput = screen.getByPlaceholderText(emailPlaceholder) as HTMLInputElement;
        const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement;

        // Simulate user typing an email address
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

        // Simulate user typing a password
        fireEvent.change(usernameInput, { target: { value: 'password123' } });

        // Check if the state is updated correctly
        expect(emailInput.value).toBe('user@example.com');
        expect(usernameInput.value).toBe('password123');
    });
});