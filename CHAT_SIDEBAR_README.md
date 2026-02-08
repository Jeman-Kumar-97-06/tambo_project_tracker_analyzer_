# Chat Sidebar Implementation

This document explains the implementation of the persistent chat sidebar that appears on the left side of every page in the Tambo AI application.

## Overview

The chat sidebar provides users with continuous access to Tambo AI functionality across all pages of the application. Users can generate components, ask questions, and interact with AI without losing context when navigating between pages.

## Architecture

### Components

1. **`ChatLayout` (`src/components/ChatLayout.tsx`)**
   - Main wrapper component that creates the sidebar layout
   - Renders the chat interface in a fixed 400px wide sidebar
   - Provides a flexible content area for page content

2. **Root Layout (`src/app/layout.tsx`)**
   - Updated to use `ChatLayout` as the main wrapper
   - Includes `TamboProvider` with all necessary configurations
   - Handles MCP server configurations globally

### Layout Structure

```
┌─────────────────────────────────────────────────┐
│ Root Layout (TamboProvider)                     │
│ ┌─────────────────────────────────────────────┐ │
│ │ ChatLayout                                  │ │
│ │ ┌─────────┐ ┌─────────────────────────────┐ │ │
│ │ │  Chat   │ │       Page Content          │ │ │
│ │ │ Sidebar │ │                             │ │ │
│ │ │ (400px) │ │        (flex-1)             │ │ │
│ │ │         │ │                             │ │ │
│ │ └─────────┘ └─────────────────────────────┘ │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Features

### Chat Sidebar Features
- **Fixed Width**: 400px minimum width for consistent layout
- **Border Separation**: Clear visual separation from main content
- **Full Height**: Takes up entire viewport height
- **Persistent State**: Chat history maintained across page navigation
- **Responsive**: Adapts to different screen sizes

### Integration Features
- **Global Configuration**: Single TamboProvider for entire app
- **Component Registration**: All Tambo components available globally
- **Tool Integration**: All registered tools accessible from any page
- **MCP Support**: Model Context Protocol servers configured globally

## Usage

### For Users
1. **Navigate to any page** - Chat sidebar is always available
2. **Ask questions** - Get help with current page content
3. **Generate components** - Create charts, tables, cards, etc.
4. **Maintain context** - Chat history persists across navigation

### For Developers

#### Adding New Pages
New pages automatically inherit the chat sidebar:

```tsx
// src/app/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="p-8">
      <h1>New Page</h1>
      <p>Chat sidebar is automatically available!</p>
    </div>
  );
}
```

#### Accessing Chat Functions
Use Tambo hooks in any page component:

```tsx
import { useTambo } from "@tambo-ai/react";

export default function MyPage() {
  const { sendThreadMessage } = useTambo();
  
  const handleAction = async () => {
    await sendThreadMessage("Generate a chart", { streamResponse: true });
  };
  
  return <button onClick={handleAction}>Generate Chart</button>;
}
```

## Page Updates

### Home Page (`src/app/page.tsx`)
- Updated with improved layout and quick action buttons
- Showcases available features and capabilities
- Provides sample interactions for users to try

### Chat Page (`src/app/chat/page.tsx`)
- Now serves as a dedicated full-screen chat experience
- Explains the sidebar functionality
- Provides navigation back to other sections

### Interactables Page (`src/app/interactables/page.tsx`)
- Removed duplicate chat interface
- Focuses on interactive component demonstrations
- Provides clear instructions for AI interaction

## CSS Considerations

### Responsive Design
The layout uses Flexbox for optimal responsiveness:

```css
.chat-layout {
  display: flex;
  height: 100vh;
}

.chat-sidebar {
  width: 400px;
  min-width: 400px;
  border-right: 1px solid var(--border);
}

.main-content {
  flex: 1;
  overflow: auto;
}
```

### Dark Mode Support
All components support dark mode through CSS variables defined in `globals.css`.

## Benefits

1. **Improved UX**: Consistent chat access across all pages
2. **Context Preservation**: No loss of conversation when navigating
3. **Simplified Architecture**: Single TamboProvider configuration
4. **Better Performance**: Shared context and components
5. **Easier Maintenance**: Centralized chat functionality

## Migration Notes

### Breaking Changes
- Pages no longer need individual `TamboProvider` wrappers
- Existing chat implementations should be removed to avoid conflicts
- Layout components may need adjustment for the new sidebar space

### Compatibility
- All existing Tambo hooks and components work unchanged
- Component registration remains in `src/lib/tambo.ts`
- Tool configurations are unchanged

## Troubleshooting

### Common Issues

1. **Nested TamboProvider Error**
   - Remove TamboProvider from individual pages
   - Use the global provider from root layout

2. **Layout Overflow**
   - Ensure main content uses `overflow-auto`
   - Test on different screen sizes

3. **Chat Not Responding**
   - Check API key configuration
   - Verify network connectivity
   - Check browser console for errors

### Debug Tips
- Use browser dev tools to inspect layout
- Check the Network tab for API calls
- Monitor console for Tambo-related logs

## Future Enhancements

Potential improvements for the chat sidebar:

1. **Collapsible Sidebar**: Add toggle to hide/show chat
2. **Resizable Width**: Allow users to adjust sidebar width
3. **Mobile Optimization**: Implement mobile-friendly chat drawer
4. **Chat Persistence**: Save chat history to localStorage
5. **Multiple Threads**: Support for multiple conversation threads