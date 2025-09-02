import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AuthScreen from "../../app/(auth)/authScreen";
import { useAuthStore } from "../../stores/authStore";

// Mock the auth store
jest.mock("../../stores/authStore");
const mockUseAuthStore = useAuthStore as jest.MockedFunction<
  typeof useAuthStore
>;

// Mock expo-router
const mockRouterPush = jest.fn();
jest.mock("expo-router", () => ({
  router: {
    push: mockRouterPush,
  },
}));

describe("AuthScreen", () => {
  const mockStore = {
    authMode: "signin" as "signin" | "signup",
    setAuthMode: jest.fn(),
    signIn: jest.fn(),
    signUp: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuthStore.mockReturnValue(mockStore);
  });

  describe("Sign In Mode", () => {
    it("should render sign in form correctly", () => {
      const { getByText, getByPlaceholderText, queryByPlaceholderText } =
        render(<AuthScreen />);

      expect(getByText("Sign In")).toBeTruthy();
      expect(getByPlaceholderText("Username")).toBeTruthy();
      expect(getByPlaceholderText("Password")).toBeTruthy();
      expect(queryByPlaceholderText("Verify Password")).toBeFalsy();
      expect(getByText("Sign In")).toBeTruthy();
      expect(getByText("Don't have an account? Sign Up")).toBeTruthy();
    });

    it("should handle successful sign in", async () => {
      mockStore.signIn.mockReturnValue(true);

      const { getByText, getByPlaceholderText } = render(<AuthScreen />);

      const usernameInput = getByPlaceholderText("Username");
      const passwordInput = getByPlaceholderText("Password");
      const signInButton = getByText("Sign In");

      fireEvent.changeText(usernameInput, "testuser");
      fireEvent.changeText(passwordInput, "123456");
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockStore.signIn).toHaveBeenCalledWith("testuser", "123456");
        expect(mockRouterPush).toHaveBeenCalledWith("/(app)/homeScreen");
      });
    });

    it("should handle failed sign in", async () => {
      mockStore.signIn.mockReturnValue(false);

      const { getByText, getByPlaceholderText } = render(<AuthScreen />);

      const usernameInput = getByPlaceholderText("Username");
      const passwordInput = getByPlaceholderText("Password");
      const signInButton = getByText("Sign In");

      fireEvent.changeText(usernameInput, "testuser");
      fireEvent.changeText(passwordInput, "wrongpass");
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockStore.signIn).toHaveBeenCalledWith("testuser", "wrongpass");
      });
    });

    it("should trim input values before submission", async () => {
      mockStore.signIn.mockReturnValue(true);

      const { getByText, getByPlaceholderText } = render(<AuthScreen />);

      const usernameInput = getByPlaceholderText("Username");
      const passwordInput = getByPlaceholderText("Password");
      const signInButton = getByText("Sign In");

      fireEvent.changeText(usernameInput, "  testuser  ");
      fireEvent.changeText(passwordInput, "  123456  ");
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(mockStore.signIn).toHaveBeenCalledWith("testuser", "123456");
      });
    });
  });

  describe("Sign Up Mode", () => {
    beforeEach(() => {
      mockStore.authMode = "signup";
    });

    it("should render sign up form correctly", () => {
      const { getByText, getByPlaceholderText } = render(<AuthScreen />);

      expect(getByText("Sign Up")).toBeTruthy();
      expect(getByPlaceholderText("Username")).toBeTruthy();
      expect(getByPlaceholderText("Password")).toBeTruthy();
      expect(getByPlaceholderText("Verify Password")).toBeTruthy();
      expect(getByText("Sign Up")).toBeTruthy();
      expect(getByText("Already have an account? Sign In")).toBeTruthy();
    });

    it("should handle successful sign up", async () => {
      mockStore.signUp.mockReturnValue(true);

      const { getByText, getByPlaceholderText } = render(<AuthScreen />);

      const usernameInput = getByPlaceholderText("Username");
      const passwordInput = getByPlaceholderText("Password");
      const verifyPasswordInput = getByPlaceholderText("Verify Password");
      const signUpButton = getByText("Sign Up");

      fireEvent.changeText(usernameInput, "newuser");
      fireEvent.changeText(passwordInput, "123456");
      fireEvent.changeText(verifyPasswordInput, "123456");
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(mockStore.signUp).toHaveBeenCalledWith(
          "newuser",
          "123456",
          "123456"
        );
        expect(mockStore.setAuthMode).toHaveBeenCalledWith("signin");
      });
    });

    it("should handle failed sign up", async () => {
      mockStore.signUp.mockReturnValue(false);

      const { getByText, getByPlaceholderText } = render(<AuthScreen />);

      const usernameInput = getByPlaceholderText("Username");
      const passwordInput = getByPlaceholderText("Password");
      const verifyPasswordInput = getByPlaceholderText("Verify Password");
      const signUpButton = getByText("Sign Up");

      fireEvent.changeText(usernameInput, "newuser");
      fireEvent.changeText(passwordInput, "123456");
      fireEvent.changeText(verifyPasswordInput, "123456");
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(mockStore.signUp).toHaveBeenCalledWith(
          "newuser",
          "123456",
          "123456"
        );
      });
    });

    it("should trim input values before submission", async () => {
      mockStore.signUp.mockReturnValue(true);

      const { getByText, getByPlaceholderText } = render(<AuthScreen />);

      const usernameInput = getByPlaceholderText("Username");
      const passwordInput = getByPlaceholderText("Password");
      const verifyPasswordInput = getByPlaceholderText("Verify Password");
      const signUpButton = getByText("Sign Up");

      fireEvent.changeText(usernameInput, "  newuser  ");
      fireEvent.changeText(passwordInput, "  123456  ");
      fireEvent.changeText(verifyPasswordInput, "  123456  ");
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(mockStore.signUp).toHaveBeenCalledWith(
          "newuser",
          "123456",
          "123456"
        );
      });
    });
  });

  describe("Mode Toggle", () => {
    it("should switch from sign in to sign up mode", () => {
      const { getByText } = render(<AuthScreen />);

      const toggleButton = getByText("Don't have an account? Sign Up");
      fireEvent.press(toggleButton);

      expect(mockStore.setAuthMode).toHaveBeenCalledWith("signup");
    });

    it("should switch from sign up to sign in mode", () => {
      mockStore.authMode = "signup";

      const { getByText } = render(<AuthScreen />);

      const toggleButton = getByText("Already have an account? Sign In");
      fireEvent.press(toggleButton);

      expect(mockStore.setAuthMode).toHaveBeenCalledWith("signin");
    });
  });

  describe("Input Handling", () => {
    it("should update username input value", () => {
      const { getByPlaceholderText } = render(<AuthScreen />);

      const usernameInput = getByPlaceholderText("Username");
      fireEvent.changeText(usernameInput, "testuser");

      expect(usernameInput.props.value).toBe("testuser");
    });

    it("should update password input value", () => {
      const { getByPlaceholderText } = render(<AuthScreen />);

      const passwordInput = getByPlaceholderText("Password");
      fireEvent.changeText(passwordInput, "123456");

      expect(passwordInput.props.value).toBe("123456");
    });

    it("should update verify password input value in signup mode", () => {
      mockStore.authMode = "signup";

      const { getByPlaceholderText } = render(<AuthScreen />);

      const verifyPasswordInput = getByPlaceholderText("Verify Password");
      fireEvent.changeText(verifyPasswordInput, "123456");

      expect(verifyPasswordInput.props.value).toBe("123456");
    });
  });
});
