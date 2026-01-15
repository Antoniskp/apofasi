# Chrome Extension Compatibility

## Issue: "Uncaught SyntaxError: Unexpected token 'export'"

### Problem Description

Some users may encounter console errors like:
```
chrome-extension://j…content_reporter.js:1 Uncaught SyntaxError: Unexpected token 'export'
Node cannot be found in the current page.
```

### Root Cause

This error originates from **third-party Chrome extensions** (not from the application code). Some Chrome extensions attempt to inject content scripts or read page scripts but are not properly configured to handle modern ES modules that use `import`/`export` syntax.

### What We've Done

To make the application more robust and prevent these third-party extension errors from interfering with the user experience, we've implemented the following fixes:

1. **Global Error Handler** (`client/index.html`)
   - Added a global error handler that suppresses errors from `chrome-extension://` sources
   - This prevents extension errors from cluttering the console and potentially breaking page functionality
   - The handler only suppresses extension errors, not application errors

2. **Vite Build Configuration** (`client/vite.config.js`)
   - Configured explicit ES module format
   - Added modulePreload polyfill for better browser compatibility
   - Set build target to 'esnext' for modern JavaScript features

### User Experience

- Users with problematic Chrome extensions will no longer see these errors in the console
- The application will continue to function normally
- Extension errors will be silently ignored (prevented from propagating)

### For Developers

If you need to debug application errors:

1. The error handler only filters errors from `chrome-extension://` URLs
2. All application errors will still be logged normally
3. You can temporarily disable the error handler by commenting out the script in `index.html`

### Recommended Action for End Users

If you encounter this error:

1. **Option 1 (Recommended)**: Update the browser and all extensions to their latest versions
2. **Option 2**: Identify and disable the problematic extension
   - Common culprits: outdated ad blockers, security scanners, or content reporting tools
   - Open Chrome DevTools → Console → Look for errors from `chrome-extension://`
   - Go to `chrome://extensions/` and disable extensions one by one to identify the problematic one
3. **Option 3**: Use the application as-is - the errors are now suppressed and won't affect functionality

### Technical Details

The error occurs when:
1. A Chrome extension injects a content script into the page
2. The extension's script contains ES6 `export` statements but isn't loaded as a module
3. The extension attempts to find or manipulate DOM nodes that don't exist in our application

Our fix ensures these extension errors don't interfere with the application's operation.
