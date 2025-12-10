import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import api from '../utils/api';

// Mock the api module
jest.mock('../utils/api');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Helper function to render with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  test('renders login form correctly', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your username or email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderWithRouter(<Login />);
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Username or email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for short password', async () => {
    renderWithRouter(<Login />);
    
    const loginInput = screen.getByPlaceholderText(/Enter your username or email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(loginInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test('successful login redirects to home page', async () => {
    // Mock successful API response
    api.post.mockResolvedValueOnce({
      data: {
        success: true,
        token: 'fake-jwt-token',
        user: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
        },
      },
    });

    renderWithRouter(<Login />);
    
    const loginInput = screen.getByPlaceholderText(/Enter your username or email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(loginInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  test('failed login shows error message', async () => {
    // Mock failed API response
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid credentials',
        },
      },
    });

    renderWithRouter(<Login />);
    
    const loginInput = screen.getByPlaceholderText(/Enter your username or email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(loginInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('remember me checkbox stores token in localStorage', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        success: true,
        token: 'fake-jwt-token',
        user: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
        },
      },
    });

    renderWithRouter(<Login />);
    
    const loginInput = screen.getByPlaceholderText(/Enter your username or email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const rememberMeCheckbox = screen.getByRole('checkbox');
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(loginInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(rememberMeCheckbox);
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    });
  });

  test('without remember me, token stores in sessionStorage', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        success: true,
        token: 'fake-jwt-token',
        user: {
          id: '123',
          username: 'testuser',
          email: 'test@example.com',
        },
      },
    });

    renderWithRouter(<Login />);
    
    const loginInput = screen.getByPlaceholderText(/Enter your username or email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(loginInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(sessionStorage.getItem('token')).toBe('fake-jwt-token');
    });
  });

  test('login button is disabled while loading', async () => {
    api.post.mockImplementation(() => new Promise(() => {})); // Never resolves

    renderWithRouter(<Login />);
    
    const loginInput = screen.getByPlaceholderText(/Enter your username or email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.change(loginInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Logging in.../i })).toBeDisabled();
    });
  });

  test('password visibility toggle works', () => {
    renderWithRouter(<Login />);
    
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    const toggleButton = screen.getByLabelText(/Show password/i);

    // Initially password type
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('forgot password link is present', () => {
    renderWithRouter(<Login />);
    
    const forgotPasswordLink = screen.getByText(/Forgot Password?/i);
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });

  test('signup link is present', () => {
    renderWithRouter(<Login />);
    
    const signupLink = screen.getByText(/Sign up/i);
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute('href', '/signup');
  });
});