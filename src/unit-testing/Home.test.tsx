import { fireEvent, render, screen } from '@testing-library/react';
import Home from '@/pages';
import { ClassAttributes, ImgHTMLAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';

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
        render(<Home />);
        
        // Check if the element rendered by LogoHeader is present
        const logoElement = screen.getByAltText(/furriends logo/i);
        expect(logoElement).not.toBeNull(); // Check if element is found
    });
});

// Testing for page content is showing up
describe('Home Component', () => {
    it('displays page content', () => {
        render(<Home />);
        
        // Check if the text "Welcome to" is present in the document
        const welcomeText = screen.getByText(/Welcome to/i);
        expect(welcomeText).not.toBeNull(); 

        // Check if the text "furriends" is present in the document
        const furriendsText = screen.getByText(/furriends/i);
        expect(furriendsText).not.toBeNull(); 

        // Check if the text "A bespoke app for modern day pet owners." is present in the document
        const subtitleText = screen.getByText(/A bespoke app for modern day pet owners./i);
        expect(subtitleText).not.toBeNull(); 

        // Check if the button with text "Sign in" is present in the document
        const signInButton = screen.getByRole('button', { name: /sign in/i });
        expect(signInButton).toBeTruthy();

        // Check if the image with the specified alt text is present
        const desktopImage = screen.getByAltText(/screenshot of the dashboard and map - desktop version/i);
        expect(desktopImage).toBeTruthy();

        const mobileImage = screen.getByAltText(/screenshot of the dashboard and map - mobile version/i);
        expect(mobileImage).toBeTruthy();
    });
});

describe('Home Component - Sign in Button', () => {
    it('navigates to /login when the Sign in button is clicked', () => {
        // Mock push function 
        const pushMock = jest.fn();
        jest.spyOn(require('next/router'), 'useRouter').mockReturnValue({ push: pushMock });
        
        // Render the Home component
        render(<Home />);
        
        // Find the Sign in button
        const signInButton = screen.getByRole('button', { name: /sign in/i });
    
        // Simulate a click event on the button
        fireEvent.click(signInButton);
        
        // Assert that the push method was called with the expected URL
        expect(pushMock).toHaveBeenCalledWith('/login');
    });
});
