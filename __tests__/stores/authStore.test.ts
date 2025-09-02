import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../../stores/authStore';

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store to initial state by clearing all data
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      // Clear all users and current user
      result.current.users = [];
      result.current.currentUser = null;
      result.current.authMode = 'signin';
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.users).toEqual([]);
      expect(result.current.currentUser).toBeNull();
      expect(result.current.authMode).toBe('signin');
    });
  });

  describe('setAuthMode', () => {
    it('should switch between signin and signup modes', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        result.current.setAuthMode('signup');
      });
      expect(result.current.authMode).toBe('signup');
      
      act(() => {
        result.current.setAuthMode('signin');
      });
      expect(result.current.authMode).toBe('signin');
    });
  });

  describe('Sign Up Validation', () => {
    it('should validate required fields', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const validation = result.current.validateSignUp('', '', '');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Username is required');
      expect(validation.errors).toContain('Password is required');
      expect(validation.errors).toContain('Verify password is required');
    });

    it('should validate password length', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const validation = result.current.validateSignUp('testuser', '123', '123');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Password must be at least 6 characters');
    });

    it('should validate password matching', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const validation = result.current.validateSignUp('testuser', '123456', '654321');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Passwords do not match');
    });

    it('should validate no leading/trailing spaces', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const validation = result.current.validateSignUp(' testuser ', '123456', '123456');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Username cannot start or end with spaces');
    });

    it('should pass validation with valid data', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const validation = result.current.validateSignUp('testuser', '123456', '123456');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
  });

  describe('Sign In Validation', () => {
    it('should validate required fields', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const validation = result.current.validateSignIn('', '');
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Username is required');
      expect(validation.errors).toContain('Password is required');
    });

    it('should pass validation with valid data', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const validation = result.current.validateSignIn('testuser', '123456');
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });
  });

  describe('Sign Up Functionality', () => {
    it('should create a new user successfully', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        const success = result.current.signUp('testuser', '123456', '123456');
        expect(success).toBe(true);
      });
      
      expect(result.current.users).toHaveLength(1);
      expect(result.current.users[0]).toEqual({
        username: 'testuser',
        password: '123456'
      });
      expect(result.current.currentUser).toEqual({
        username: 'testuser',
        password: '123456'
      });
      expect(result.current.authMode).toBe('signin');
    });

    it('should prevent duplicate usernames', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Create first user
      act(() => {
        const success = result.current.signUp('testuser', '123456', '123456');
        expect(success).toBe(true);
      });
      
      // Try to create duplicate user
      act(() => {
        const success = result.current.signUp('testuser', '654321', '654321');
        expect(success).toBe(false);
      });
      
      expect(result.current.users).toHaveLength(1);
    });

    it('should fail signup with invalid data', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        const success = result.current.signUp('', '123', '123');
        expect(success).toBe(false);
      });
      
      expect(result.current.users).toHaveLength(0);
      expect(result.current.currentUser).toBeNull();
    });
  });

  describe('Sign In Functionality', () => {
    it('should sign in existing user successfully', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Create user first
      act(() => {
        result.current.signUp('testuser', '123456', '123456');
      });
      
      // Sign in with correct credentials
      act(() => {
        const success = result.current.signIn('testuser', '123456');
        expect(success).toBe(true);
      });
      
      expect(result.current.currentUser).toEqual({
        username: 'testuser',
        password: '123456'
      });
    });

    it('should fail sign in with wrong username', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Create user first
      act(() => {
        result.current.signUp('testuser', '123456', '123456');
      });
      
      // Try to sign in with wrong username
      act(() => {
        const success = result.current.signIn('wronguser', '123456');
        expect(success).toBe(false);
      });
      
      expect(result.current.currentUser).toBeNull();
    });

    it('should fail sign in with wrong password', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Create user first
      act(() => {
        result.current.signUp('testuser', '123456', '123456');
      });
      
      // Try to sign in with wrong password
      act(() => {
        const success = result.current.signIn('testuser', 'wrongpass');
        expect(success).toBe(false);
      });
      
      expect(result.current.currentUser).toBeNull();
    });

    it('should fail sign in with non-existent user', () => {
      const { result } = renderHook(() => useAuthStore());
      
      act(() => {
        const success = result.current.signIn('nonexistent', '123456');
        expect(success).toBe(false);
      });
      
      expect(result.current.currentUser).toBeNull();
    });
  });

  describe('Sign Out Functionality', () => {
    it('should clear current user on sign out', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Create and sign in user
      act(() => {
        result.current.signUp('testuser', '123456', '123456');
      });
      
      expect(result.current.currentUser).not.toBeNull();
      
      // Sign out
      act(() => {
        result.current.signOut();
      });
      
      expect(result.current.currentUser).toBeNull();
      // Users array should still contain the user
      expect(result.current.users).toHaveLength(1);
    });
  });

  describe('Multiple Users Support', () => {
    it('should support multiple user accounts', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Create first user
      act(() => {
        const success = result.current.signUp('user1', '123456', '123456');
        expect(success).toBe(true);
      });
      
      // Create second user
      act(() => {
        const success = result.current.signUp('user2', '654321', '654321');
        expect(success).toBe(true);
      });
      
      expect(result.current.users).toHaveLength(2);
      expect(result.current.users).toEqual([
        { username: 'user1', password: '123456' },
        { username: 'user2', password: '654321' }
      ]);
    });

    it('should allow switching between users', () => {
      const { result } = renderHook(() => useAuthStore());
      
      // Create users
      act(() => {
        result.current.signUp('user1', '123456', '123456');
      });
      
      act(() => {
        result.current.signUp('user2', '654321', '654321');
      });
      
      // Sign in as user1
      act(() => {
        const success = result.current.signIn('user1', '123456');
        expect(success).toBe(true);
      });
      expect(result.current.currentUser?.username).toBe('user1');
      
      // Sign out
      act(() => {
        result.current.signOut();
      });
      
      // Sign in as user2
      act(() => {
        const success = result.current.signIn('user2', '654321');
        expect(success).toBe(true);
      });
      expect(result.current.currentUser?.username).toBe('user2');
    });
  });
});
