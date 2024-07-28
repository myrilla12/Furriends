import ForgotPassword from '@/pages/login/forgot-password';
import { MantineProvider } from '@mantine/core';
import { fireEvent, render as rtlRender, screen } from '@testing-library/react';

// Custom render function
function render(ui: React.ReactElement, options = {}) {
    return rtlRender(
      <MantineProvider>
        {ui}
      </MantineProvider>,
      options
    );
}

// Testing for image in LogoHeader
describe('LogoHeader Component', () => {
    it('displays the logo', () => {
        render(<ForgotPassword />);
        
        // Check if the element rendered by LogoHeader is present
        const logoElement = screen.getByAltText(/furriends logo/i);
        expect(logoElement).not.toBeNull(); // Check if element is found
    });
});

describe('ForgotPassword Component', () => {
    it('renders the ForgotPassword page component correctly', () => {
        render(<ForgotPassword />);

        // All expected texts to be rendered
        const texts = screen.queryAllByText(/Forgot your password?|Enter your email address/i)

        // Check if each text is present
        texts.forEach(text => {
            expect(text).toBeTruthy();
        })

        // Check if the button with text "Get password reset email" is present in the document
        const resetButton = screen.getByRole('button', { name: /Get password reset email/i });
        expect(resetButton).toBeTruthy();
    });
});

describe('ForgotPassword Component', () => {
    it('updates email state correctly when user types in input fields', () => {
        render(<ForgotPassword />);
  
        // Simulate user typing an email address
        const emailInput = screen.getByPlaceholderText(/email address/i) as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

        // Check if the state is updated correctly
        expect(emailInput.value).toBe('user@example.com');
    });
});

describe('ForgotPassword Component - Return to sign in Button', () => {
    it('navigates to /login when clicked', () => {
        // Mock push function 
        const pushMock = jest.fn();
        jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({ push: pushMock });
        
        // Render the component
        render(<ForgotPassword/>);
        
        // Find the Sign In button
        const signInButton = screen.getByRole('button', { name: /sign in/i });
    
        // Simulate a click event on the button
        fireEvent.click(signInButton);
        
        // Assert that the push method was called with the expected URL
        expect(pushMock).toHaveBeenCalledWith('/login');
    });
});