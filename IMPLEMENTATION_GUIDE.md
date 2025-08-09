# ExtendModal Implementation Guide

## Overview
The ExtendModal has been successfully implemented in the ThreadDetail screen, allowing users to extend their story with custom content and tone selection.

## How to Access the Modal

1. **Navigate to ThreadDetail screen** - Open any thread/story
2. **Tap the ellipsis button (⋮)** - Located in the top-right corner of the screen
3. **Modal opens** - ExtendModal slides up from bottom with backdrop

## Modal Features

### Content Input
- Large text input field with placeholder "Enter your story direction..."
- Multiline support for detailed story directions
- Required field - extend button is disabled when empty

### Tone Selection
- 7 tone options available:
  - **Default** (📚) - Standard storytelling
  - **Character** (👤) - Character-focused narrative  
  - **Spicy** (🔥) - More intense/exciting content
  - **Emotion** (❤️) - Emotional storytelling
  - **Dark** (🌙) - Darker narrative themes
  - **Comedy** (😊) - Humorous content
  - **Clash** (⚡) - Conflict-driven narrative

### Action Buttons
- **Cancel** - Closes modal without action
- **Extend Story** - Submits content and tone to extend the story
- Shows "Extending..." during API call

## Technical Implementation

### Files Modified/Created:

1. **`components/ExtendModal.tsx`** (NEW)
   - Modal component with content input and tone selection
   - Follows existing app design patterns
   - Proper validation and loading states

2. **`app/ThreadDetail.tsx`** (MODIFIED)
   - Added modal state management
   - Added trigger button (ellipsis in header)
   - Integrated ExtendModal component

3. **`hooks/useThreadDetail.ts`** (MODIFIED)
   - Added `onExtendWithContent` function
   - Handles API call to expand thread with custom content/tone
   - Updates passages and user profile

### Key Features:
- ✅ Slide-up animation with backdrop
- ✅ Dark theme matching app design  
- ✅ Proper input validation
- ✅ Loading state handling
- ✅ Diamond cost checking (3 diamonds required)
- ✅ Follows existing modal patterns (RollCallModal)

## API Integration

The modal integrates with the existing `expandThread` API:
```typescript
const payload = {
  content: userEnteredContent,
  tone: selectedTone
};
const response = await expandThread(threadId, payload);
```

## User Flow

1. User taps ellipsis (⋮) in ThreadDetail header
2. ExtendModal slides up from bottom
3. User enters story direction in text field
4. User selects desired tone (defaults to "Default")
5. User taps "Extend Story" button
6. Modal shows loading state ("Extending...")
7. API call is made to extend the story
8. New story content is added to the thread
9. Modal closes automatically on success
10. User profile diamond count is updated

## Styling

The modal uses the app's existing color scheme:
- Background: `#232136` (dark purple)
- Accent: `#7ee2ff` (light blue)
- Text: `#fff` (white)
- Secondary: `#2d2a4a` (lighter purple)

## Error Handling

- Diamond validation (redirects to InAppPurchase if insufficient)
- API error handling with console logging
- Input validation (content required)
- Loading state prevents duplicate submissions