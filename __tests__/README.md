# Testing Documentation

This project includes a comprehensive test suite for the authentication flow using Jest and React Native Testing Library.

## Test Structure

```
__tests__/
├── setup.js                 # Test environment setup and mocks
├── stores/
│   └── authStore.test.ts   # Zustand store unit tests
└── components/
    └── AuthScreen.test.tsx # React component tests
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (recommended for development)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Coverage

### Auth Store Tests (`stores/authStore.test.ts`)
- ✅ **Initial State** - Verifies correct store initialization
- ✅ **Mode Switching** - Tests signin/signup mode changes
- ✅ **Sign Up Validation** - Comprehensive input validation testing
- ✅ **Sign In Validation** - Username/password validation
- ✅ **User Management** - Create, authenticate, and manage users
- ✅ **Multiple Users** - Support for multiple user accounts
- ✅ **Data Persistence** - Store state management

### AuthScreen Component Tests (`components/AuthScreen.test.tsx`)
- ✅ **Rendering** - Correct form display for both modes
- ✅ **User Interactions** - Input handling and form submission
- ✅ **Authentication Flow** - Successful and failed sign in/up
- ✅ **Mode Toggle** - Switching between signin and signup
- ✅ **Input Validation** - Form field updates and trimming
- ✅ **Error Handling** - Alert messages and user feedback

## Test Features

### Mocking Strategy
- **AsyncStorage** - Mocked for consistent testing
- **Expo Router** - Navigation functions mocked
- **React Native Alert** - Alert dialogs mocked
- **Zustand Store** - Store functions mocked for component tests

### Test Utilities
- **React Hook Testing** - `renderHook` for store testing
- **Component Testing** - `render` and `fireEvent` for UI testing
- **Async Testing** - `waitFor` for asynchronous operations
- **Mock Management** - Comprehensive mock setup and cleanup

## Writing New Tests

### For Store Functions
```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../../stores/authStore';

describe('New Feature', () => {
  it('should work correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      // Perform action
    });
    
    expect(result.current.someValue).toBe(expectedValue);
  });
});
```

### For Components
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should handle user interaction', () => {
    const { getByText } = render(<MyComponent />);
    
    const button = getByText('Click Me');
    fireEvent.press(button);
    
    // Assert expected behavior
  });
});
```

## Best Practices

1. **Test Isolation** - Each test should be independent
2. **Mock Cleanup** - Clear mocks between tests
3. **Descriptive Names** - Test names should explain what they test
4. **Coverage** - Aim for high test coverage of business logic
5. **Realistic Data** - Use realistic test data that matches real usage

## Troubleshooting

### Common Issues
- **TypeScript Errors** - Ensure `@types/jest` is installed
- **Mock Failures** - Check mock setup in `setup.js`
- **Async Issues** - Use `waitFor` for asynchronous operations
- **Component Rendering** - Verify all required props are provided

### Debug Mode
Run tests with verbose output:
```bash
npm test -- --verbose
```
