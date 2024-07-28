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

        // All expected texts to be rendered
        const texts = screen.queryAllByText(/Email address|Password|Don't have an account yet?|Trouble signing in?/i)

        // Check if each text is present
        texts.forEach(text => {
            expect(text).toBeTruthy();
        })
    });
});

describe('LoginBox Component', () => {
    it('updates email and password state correctly when user types in input fields', () => {
        render(<Login />);
  
        const inputs = screen.queryAllByPlaceholderText(/email address|password/i);
        const [emailInput, passwordInput, confirmPasswordInput] = inputs as HTMLInputElement[];

        // Simulate user typing an email address
        fireEvent.change(emailInput, { target: { value: 'user@example.com' } });

        // Simulate user typing a password
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