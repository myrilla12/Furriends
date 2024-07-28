import LoginBox from "@/components/login/loginBox";
import Login from "@/pages/login";
import { ClassAttributes, ImgHTMLAttributes } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

type NextImageProps = JSX.IntrinsicAttributes & ClassAttributes<HTMLImageElement> & ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
};

// Mocking Image component
jest.mock('next/image', () => (props: NextImageProps) => {
    const { priority, ...imgProps } = props;
    return <img {...imgProps} />;
});

// Testing for image in LogoHeader
describe('LogoHeader Component', () => {
    it('displays the logo', () => {
        render(<Login />);
        
        // Check if the element rendered by LogoHeader is present
        const logoElement = screen.getByAltText(/furriends logo/i);
        expect(logoElement).not.toBeNull(); // Check if element is found
    });
});

describe('LoginBox Component', () => {
    it('renders the LoginBox component correctly', () => {
        render(<Login />);
        
        // Check if the text "Email address" is present
        const emailAddressText = screen.getByText(/Email address/i);
        expect(emailAddressText).toBeTruthy();
        
        // Check if the text "Don't have an account yet?" is present
        const signUpText = screen.getByText(/Don't have an account yet?/i);
        expect(signUpText).toBeTruthy();

        // Check if the text "Trouble signing in?" is present
        const resetText = screen.getByText(/Trouble signing in?/i);
        expect(resetText).toBeTruthy();
    });
});

describe('LoginBox Component', () => {
    it('updates email and password state correctly when user types in input fields', () => {
        render(<Login />);
  
        // Simulate user typing an email address
        const emailInput = screen.getByPlaceholderText(/email address/i) as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
        
        // Simulate user typing a password
        const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Check if the state is updated correctly
        expect(emailInput.value).toBe('user@example.com');
        expect(passwordInput.value).toBe('password123');
    });
});

describe('LoginBox Component - Sign up Button', () => {
    it('navigates to /signup when the Sign up button is clicked', () => {
        // Mock push function 
        const pushMock = jest.fn();
        jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({ push: pushMock });
        
        // Render the Login component
        render(<Login/>);
        
        // Find the Sign up button
        const signUpButton = screen.getByRole('button', { name: /sign up/i });
    
        // Simulate a click event on the button
        fireEvent.click(signUpButton);
        
        // Assert that the push method was called with the expected URL
        expect(pushMock).toHaveBeenCalledWith('/signup');
    });
});

describe('LoginBox Component - Reset password Button', () => {
    it('navigates to /login/forgot-password when clicked', () => {
        // Mock push function 
        const pushMock = jest.fn();
        jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({ push: pushMock });
        
        // Render the Login component
        render(<Login/>);
        
        // Find the button
        const resetButton = screen.getByRole('button', { name: /reset password/i });
    
        // Simulate a click event on the button
        fireEvent.click(resetButton);
        
        // Assert that the push method was called with the expected URL
        expect(pushMock).toHaveBeenCalledWith('/login/forgot-password');
    });
});