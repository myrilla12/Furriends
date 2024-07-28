import Login from "@/pages/login";
import { fireEvent, render, screen } from '@testing-library/react';
import { createClient } from '@/utils/supabase/component';
import { setCookie } from "nookies";
import LoginBox from "@/components/login/loginBox";

// Mock nookies
jest.mock('nookies', () => ({
    setCookie: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('LoginBox Component', () => {
    it('renders the LoginBox component correctly', () => {
        render(<Login />);
        
        // Check if the text "Email address" is present
        const emailAddressText = screen.getByText(/Email address/i);
        expect(emailAddressText).toBeTruthy();

        // Check if the text "Password" is present
        const passwordText = screen.getByText(/Email address/i);
        expect(passwordText).toBeTruthy();

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