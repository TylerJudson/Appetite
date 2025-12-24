# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Appetite is a cross-platform (iOS, Android, Web) recipe management and social media app built with React Native and Expo. Users can save recipes, build profiles, share posts, and discover recipes from others.

**Tech Stack:**
- React Native 0.81.5 with Expo SDK 54
- TypeScript 5.9
- React 19.1.0
- Firebase 11 (Authentication, Realtime Database)
- React Navigation 7 (Native Stack + Bottom Tabs)
- React Native Paper 5.14 (Material Design components)
- React Native Reanimated 4.1 (Animations)

## Development Commands

### Running the App
```bash
# Start development server
yarn start

# Run on specific platform
yarn android
yarn ios
yarn web
```

### Testing
```bash
# Run tests in watch mode
yarn test
```

### Deployment
The app uses EAS (Expo Application Services) for builds and updates. GitHub Actions automatically publishes updates on every push to master.

## Architecture

### Global State Management
The app uses React Context for state management (see `state.tsx`):

- **UserContext**: Current authenticated user from Firebase Auth
- **RecipeBookStateContext**: User's collection of recipes with real-time Firebase sync
- **SettingsContext**: App settings (theme color, favorites sorting)

All state providers are wrapped in `GlobalStateProvider` at the app root. State changes automatically persist to AsyncStorage and Firebase.

### Firebase Integration
Firebase configuration is in `firebaseConfig.ts`. Two main integration points:

1. **Authentication** (`FireBase/Authentication.ts`): Email/password auth, account creation, password reset
2. **Realtime Database** (`state.tsx`): Real-time sync of recipes, user profiles, and social features

Data structure in Firebase:
- `/users/{uid}/recipes/{recipeId}` - User's recipes
- `/users/{uid}/recipeImages/{recipeId}` - Recipe images (base64)
- `/users-publicInfo/{uid}` - Public profile data

### Navigation Structure
Stack-based navigation (`Views/navigation/index.tsx`) with a bottom tab navigator:

**Main Stack:**
- `Appetite` - Home screen with bottom tabs (Recipes, Discover, Social, Settings)
- `Recipe` - View individual recipe
- `EditCreate` - Create or edit recipe (gesture disabled)
- `Account` - User account settings
- `PublicProfile` - View another user's profile
- `Friends` - Friends list
- `CreatePost` - Create social post (gesture disabled)
- `PostScreen` - View individual post (modal)

**Bottom Tabs** (in Appetite screen):
- Recipes - User's recipe collection
- Discover - Browse and search recipes
- Social - Friend posts and activity (only shown when logged in)
- Settings - App settings and account

### Data Models
Located in `Models/` directory:

- **Recipe** (`Recipe.ts`): Core recipe data with ingredients, instructions, times, tags, images
- **RecipeBook** (`RecipeBook.ts`): Collection of recipes with add/delete/import operations, tag aggregation, and AsyncStorage persistence
- **User** (`User.ts`): User profile data
- **Post** (`Post.ts`): Social media post
- **Result** (`Result.ts`): Success/failure wrapper for operations

### View Organization
Each main feature has its own directory under `Views/`:

- `Recipes/` - Recipe list with filtering by tags
- `ViewRecipe/` - Recipe detail view with ingredients, instructions, sharing
- `EditCreateRecipe/` - Recipe creation/editing form
- `Discover/` - Recipe discovery with search and tags
- `Social/` - Social feed, posts, comments
- `Settings/` - App settings, account management, theme picker

Components are organized in `Components/` subdirectories within each view.

### Theming
The app supports 8 color themes (red, orange, yellow, green, blue, indigo, purple, pink) with both light and dark variants. Theme configuration is in `themes.ts` using React Native Paper's theme system. The active theme responds to system color scheme (light/dark) and user's selected color.

## Key Patterns

### Recipe CRUD Operations
Recipes are managed through the `RecipeBook` model which automatically:
1. Updates local state via React Context
2. Persists to AsyncStorage
3. Syncs to Firebase Realtime Database (if user is authenticated)

Real-time listeners in `state.tsx` sync changes from Firebase back to local state.

### Navigation with Snackbar
The `Appetite` screen (bottom tab container) handles a snackbar system for app-wide notifications. Screens can trigger snackbars by navigating back with params:
```typescript
navigation.navigate("Appetite", {
  snackBar: {
    visible: true,
    message: "Recipe deleted",
    action: { label: "Undo", onPressCode: "undoDelete", recipe: deletedRecipe }
  }
});
```

### Image Handling
Images are stored as base64 strings and managed through:
- `expo-image-picker` for selecting images
- `expo-image-manipulator` for resizing/compression
- Firebase Realtime Database for storage (separate node from recipe data)

### Utilities
Located in `utilities/`:
- `AsyncHelpers.ts` - AsyncStorage get/save operations
- `Alert.ts` - Cross-platform alert dialogs
- `filter.ts` - Recipe filtering logic
- `importToObject.ts` - Data import helpers
