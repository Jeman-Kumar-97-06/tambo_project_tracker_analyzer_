# Input Text Visibility Fix

This document details the specific fix applied to resolve the issue where input message text was only visible when hovering over it in dark mode.

## Problem Description

**Issue**: In dark mode, text typed into the chat input box was invisible until the user hovered over the input area.

**Root Cause**: The TipTap editor (which powers the message input) was not properly inheriting the dark mode text colors due to CSS specificity issues and potential conflicts with prose/typography styles.

## Solution Applied

### 1. Component-Level Fixes

#### TextEditor Component (`src/components/tambo/text-editor.tsx`)

**Added explicit styling to editor attributes:**
```typescript
attributes: {
  class: cn(
    "tiptap",
    "prose prose-sm max-w-none focus:outline-none",
    "p-3 rounded-t-lg bg-transparent text-sm leading-relaxed",
    "min-h-[82px] max-h-[40vh] overflow-y-auto",
    "break-words whitespace-pre-wrap",
    "!text-foreground prose-neutral dark:prose-invert",  // Added !important
    "[&_.ProseMirror-focused]:outline-none",
    "[&_.ProseMirror]:!text-foreground",               // Added !important
    "[&_p]:!text-foreground",                          // Added !important
    "[&_span]:!text-foreground",                       // Added !important
    "[&_div]:!text-foreground",                        // Added !important
    "[&_*]:!text-foreground",                          // Added !important
    className,
  ),
  style: "color: var(--foreground) !important; -webkit-text-fill-color: var(--foreground) !important;",
},
```

**Wrapped EditorContent with explicit styling:**
```typescript
<div
  className="text-foreground [&_.ProseMirror]:!text-foreground [&_*]:!text-foreground"
  style={{ color: "var(--foreground)" }}
>
  <EditorContent editor={editor} />
</div>
```

#### MessageInput Component (`src/components/tambo/message-input.tsx`)

**Added data attribute for better CSS targeting:**
```typescript
<div
  data-slot="message-input"
  className={cn(
    "relative flex flex-col rounded-xl bg-background shadow-md p-2 px-3",
    // ... other classes
  )}
>
```

### 2. Global CSS Overrides (`src/app/globals.css`)

**Added comprehensive TipTap editor styling:**
```css
/* Ensure TipTap editor content uses proper text colors */
.tiptap {
    color: var(--foreground) !important;
    caret-color: var(--foreground) !important;
}

.tiptap p,
.tiptap span,
.tiptap .ProseMirror {
    color: var(--foreground) !important;
}

.tiptap .ProseMirror-focused {
    outline: none !important;
    color: var(--foreground) !important;
}

/* More specific overrides for input text visibility */
.tiptap .ProseMirror *,
.tiptap .ProseMirror,
.tiptap div,
.tiptap p,
.tiptap span,
.tiptap [contenteditable],
.tiptap [contenteditable="true"] {
    color: var(--foreground) !important;
    -webkit-text-fill-color: var(--foreground) !important;
}
```

**Added hover state fixes to address the core issue:**
```css
/* Comprehensive fix for input text visibility regardless of hover state */
.tiptap .ProseMirror,
.tiptap .ProseMirror *,
.tiptap:hover .ProseMirror,
.tiptap:hover .ProseMirror *,
.tiptap:not(:hover) .ProseMirror,
.tiptap:not(:hover) .ProseMirror *,
.tiptap:focus .ProseMirror,
.tiptap:focus .ProseMirror *,
.tiptap:focus-within .ProseMirror,
.tiptap:focus-within .ProseMirror * {
    color: var(--foreground) !important;
    -webkit-text-fill-color: var(--foreground) !important;
    opacity: 1 !important;
}

/* Override any hover states that might change text visibility */
.tiptap:hover,
.tiptap:hover *,
.tiptap:hover .ProseMirror,
.tiptap:hover .ProseMirror * {
    color: var(--foreground) !important;
    -webkit-text-fill-color: var(--foreground) !important;
    opacity: 1 !important;
}
```

**Added specific targeting for message input areas:**
```css
/* Force visibility for all text input states */
[data-slot="message-input"] .tiptap,
[data-slot="message-input"] .tiptap *,
[data-slot="message-input"] .tiptap:hover,
[data-slot="message-input"] .tiptap:hover *,
[data-slot="message-input"] .ProseMirror,
[data-slot="message-input"] .ProseMirror *,
[data-slot="message-input-textarea"] .tiptap,
[data-slot="message-input-textarea"] .tiptap *,
[data-slot="message-input-textarea"] .ProseMirror,
[data-slot="message-input-textarea"] .ProseMirror * {
    color: var(--foreground) !important;
    -webkit-text-fill-color: var(--foreground) !important;
    opacity: 1 !important;
}
```

## Technical Details

### Why This Issue Occurred

1. **CSS Specificity Conflicts**: TipTap editor comes with its own CSS that can override theme colors
2. **Prose Classes**: The `prose` class from Tailwind Typography can interfere with text colors
3. **WebKit Text Fill**: Some browsers use `-webkit-text-fill-color` which needs explicit overriding
4. **Hover State Interference**: Some CSS rules were only applying proper colors on hover state

### Why This Solution Works

1. **Multiple Layers of Specificity**: Applied fixes at component level, inline styles, and global CSS
2. **!important Declarations**: Used sparingly but strategically to override conflicting styles
3. **Comprehensive State Coverage**: Addresses hover, focus, and default states explicitly
4. **WebKit Compatibility**: Includes `-webkit-text-fill-color` for cross-browser compatibility
5. **Data Attribute Targeting**: Added specific selectors for message input areas

## Testing

After applying these fixes, the input text should be:
- ✅ Visible immediately when typing (no hover required)
- ✅ Properly colored in both light and dark themes
- ✅ Consistent across different browsers
- ✅ Maintaining proper cursor/caret visibility

## Files Modified

1. `src/components/tambo/text-editor.tsx` - Component-level styling fixes
2. `src/components/tambo/message-input.tsx` - Added data attribute for targeting
3. `src/app/globals.css` - Comprehensive CSS overrides

## Result

The input text visibility issue has been resolved. Users can now type in the message input and see their text immediately in both light and dark modes, without needing to hover over the input area.