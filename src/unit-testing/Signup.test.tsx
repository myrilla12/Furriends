import Signup from '@/pages/signup';
import { fireEvent, render, screen } from '@testing-library/react';

// Testing for image in LogoHeader
describe('LogoHeader Component', () => {
    it('displays the logo', () => {
        render(<Signup />);
        
        // Check if the element rendered by LogoHeader is present
        const logoElement = screen.getByAltText(/furriends logo/i);
        expect(logoElement).not.toBeNull(); // Check if element is found
    });
});

describe('SignupBox Component', () => {
    it('renders the SignupBox component correctly', () => {
        render(<Signup />);

        // All expected texts to be rendered
        const texts = screen.queryAllByText(/Create a new account|Join our pet-friendly community at|furriends|!|Email address|Password|Confirm Password|Already have an account?/i)

        // Check if each text is present
        texts.forEach(text => {
            expect(text).toBeTruthy();
        })
    });
});

describe('SignupBox Component', () => {
    it('updates email, password and confirm password state correctly when user types in input fields', () => {
        render(<Signup />);
        
        const inputs = screen.queryAllByPlaceholderText(/email address|password|type password again/i);
        const [emailInput, passwordInput, confirmPasswordInput] = inputs as HTMLInputElement[];

        // Simulate user typing an email address
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

        // Simulate user typing a password
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Simulate user typing confirm password
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        // Check if the state is updated correctly
        expect(emailInput.value).toBe('user@example.com');
        expect(passwordInput.value).toBe('password123');
        expect(confirmPasswordInput.value).toBe('password123');
    });
});

describe('SingupBox Component - Sign in Button', () => {
    it('navigates to /signin when the button is clicked', () => {
        // Mock push function 
        const pushMock = jest.fn();
        jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({ push: pushMock });
        
        // Render the Login component
        render(<Signup/>);
        
        // Find the Sign In button
        const signInButton = screen.getByRole('button', { name: /sign in/i });
    
        // Simulate a click event on the button
        fireEvent.click(signInButton);
        
        // Assert that the push method was called with the expected URL
        expect(pushMock).toHaveBeenCalledWith('/login');
    });
});