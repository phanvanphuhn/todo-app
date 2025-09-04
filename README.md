# 📱 Todo App - React Native

A modern React Native todo application with user authentication, todo management, and profile customization features.

## 🏗️ App Architecture Overview

The app follows a **tab-based navigation structure** with authentication flow:

```
App Entry Point
├── Root Layout (_layout.tsx)
├── Auth Flow (auth)
│   └── AuthScreen (Sign In/Sign Up)
└── Main App (app)
    ├── HomeScreen (Todo List)
    └── ProfileScreen (Avatar Upload)
```

## 🔐 Authentication Flow

### AuthStore (`stores/authStore.ts`)
**Purpose**: Manages user authentication state with persistent storage

**Key Features**:
- **Persistent Storage**: Uses AsyncStorage via Zustand middleware
- **User Management**: Stores multiple user accounts locally
- **Validation**: Built-in form validation for sign up/sign in

**State Structure**:
```typescript
interface User {
  username: string;
  password: string;
  avatar?: string;  // Added for profile functionality
}

interface AuthState {
  users: User[];           // All registered users
  currentUser: User | null; // Currently logged in user
  authMode: 'signin' | 'signup';
}
```

**Core Functions**:
- `signUp(username, password, verifyPassword)` - Creates new account
- `signIn(username, password)` - Authenticates existing user
- `signOut()` - Logs out current user
- `updateAvatar(avatarUri)` - Updates user's profile picture
- `validateSignUp()` - Validates sign up form
- `validateSignIn()` - Validates sign in form

### AuthScreen (`app/(auth)/authScreen.tsx`)
**Purpose**: Handles user authentication (Sign In/Sign Up)

**UI Components**:
- **Dynamic Title**: Changes based on auth mode
- **Form Fields**: Username, Password, Verify Password (signup only)
- **Toggle Button**: Switches between Sign In/Sign Up modes
- **Submit Button**: Processes authentication

**Flow**:
1. User enters credentials
2. Form validation occurs
3. AuthStore processes request
4. On success: Navigate to HomeScreen
5. On failure: Show error alert

## 📋 Todo Management Flow

### TodoStore (`stores/todoStore.ts`)
**Purpose**: Manages todo items with persistent storage

**State Structure**:
```typescript
interface Todo {
  id: string;        // Unique identifier
  text: string;      // Todo content
  completed: boolean; // Completion status
  createdAt: Date;   // Creation timestamp
}
```

**Core Functions**:
- `addTodo(text)` - Creates new todo item
- `toggleTodo(id)` - Toggles completion status
- `deleteTodo(id)` - Removes todo item
- `clearCompleted()` - Bulk removes completed todos

### HomeScreen (`app/(app)/homeScreen.tsx`)
**Purpose**: Main todo list interface

**UI Components**:
- **Header**: Title + "Clear Completed" button
- **Input Section**: TextInput + Add button
- **Todo List**: FlatList with TodoItem components
- **Empty State**: Friendly message when no todos exist

**TodoItem Component**:
- **Checkbox**: Circular checkbox with checkmark
- **Todo Text**: Shows with strikethrough when completed
- **Delete Button**: Red X with confirmation dialog

**User Interactions**:
1. **Add Todo**: Type text → Press Add button or Enter
2. **Toggle Todo**: Tap anywhere on todo item
3. **Delete Todo**: Tap X button → Confirm deletion
4. **Clear Completed**: Tap header button → Confirm bulk deletion

## 👤 Profile Management Flow

### ProfileScreen (`app/(app)/profileScreen.tsx`)
**Purpose**: User profile with avatar upload functionality

**UI Components**:
- **Avatar Display**: Shows user's photo or default icon
- **Upload Button**: Plus icon overlay for adding/changing avatar
- **Username Display**: Shows current user's name

**Avatar Upload Flow**:
1. **Permission Request**: Requests camera/media library access
2. **Source Selection**: Choose Camera or Photo Library
3. **Image Picker**: Opens native image picker with 1:1 crop
4. **Avatar Update**: Updates user's avatar in AuthStore
5. **UI Update**: Immediately displays new avatar

**Key Features**:
- **Dual Source**: Camera capture or photo library selection
- **Image Editing**: Automatic 1:1 aspect ratio cropping
- **Permission Handling**: Graceful permission request/denial
- **Error Handling**: User-friendly error messages
- **Persistent Storage**: Avatar persists across app sessions

## 🔄 Complete App Flow

### Initial Launch:
1. App starts → Root Layout loads
2. Check AuthStore for currentUser
3. If no user → Navigate to AuthScreen
4. If user exists → Navigate to HomeScreen

### Authentication Flow:
1. **Sign Up**: Enter details → Validation → Account creation → Auto-switch to Sign In
2. **Sign In**: Enter credentials → Validation → Set currentUser → Navigate to HomeScreen
3. **Logout**: ProfileScreen logout button → Clear currentUser → Navigate to AuthScreen

### Main App Flow:
1. **Tab Navigation**: HomeScreen ↔ ProfileScreen
2. **Todo Management**: Add, toggle, delete todos (persisted locally)
3. **Profile Management**: Upload/change avatar (persisted locally)

## 💾 Data Persistence

### Storage Strategy:
- **AuthStore**: Persists users array and currentUser
- **TodoStore**: Persists todos array
- **Storage Method**: AsyncStorage via Zustand middleware
- **Storage Keys**: 
  - `auth-storage` (users, currentUser)
  - `todo-storage` (todos)

### Data Flow:
```
User Actions → Store Actions → Zustand State → AsyncStorage
                ↓
UI Components ← Store State ← Zustand State ← AsyncStorage (on app restart)
```

## 🎯 Key Features Summary

✅ **Authentication**: Sign up, sign in, logout with validation  
✅ **Todo Management**: Add, toggle, delete, bulk clear todos  
✅ **Avatar Upload**: Camera/photo library with image editing  
✅ **Persistent Storage**: All data survives app restarts  
✅ **Modern UI**: Clean, intuitive interface with proper feedback  
✅ **Error Handling**: User-friendly alerts and validation  
✅ **Tab Navigation**: Seamless switching between Home and Profile  

## 🚀 Getting Started

### Prerequisites
- Node.js
- Expo CLI
- React Native development environment

### Installation
```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Dependencies
- **expo**: React Native framework
- **expo-router**: File-based routing
- **expo-image-picker**: Image selection and camera access
- **zustand**: State management
- **@react-native-async-storage/async-storage**: Local storage
- **@expo/vector-icons**: Icon library

## 📱 Screenshots

The app provides a complete todo management experience with user authentication and profile customization, all with local data persistence for offline functionality.
