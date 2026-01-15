# MUI Performance Best Practices

This document outlines the Material-UI implementation strategy for the Apofasi project, focusing on keeping the application lightweight and fast, especially on mobile devices.

## Table of Contents

1. [Package Strategy](#package-strategy)
2. [Import Strategy](#import-strategy)
3. [Styling Optimization](#styling-optimization)
4. [Theme Configuration](#theme-configuration)
5. [Lazy Loading](#lazy-loading)
6. [Mobile Optimization](#mobile-optimization)
7. [Production Build](#production-build)
8. [Bundle Size Management](#bundle-size-management)

## Package Strategy

### ✅ What We Use

- `@mui/material` - Core MUI components
- `@emotion/react` - Required peer dependency
- `@emotion/styled` - Required peer dependency

### ❌ What We Avoid

- `@mui/icons-material` - Icons package can dominate bundle size. Instead:
  - Use system icons (emoji, unicode symbols)
  - Use Font Awesome (already included)
  - Use a smaller icon library like `lucide-react` if needed
- `@mui/lab` - Experimental components, often heavier and less stable

## Import Strategy

### ✅ Best Practice: Path Imports (Tree-shaking friendly)

```javascript
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
```

**Why?** This ensures the bundler only includes the components you use.

### ⚠️ Less Optimal: Named Imports

```javascript
import { Button, TextField } from '@mui/material';
```

While modern bundlers handle this, path imports are the safest approach for minimal output.

## Styling Optimization

### Static sx Objects

Define `sx` objects outside components to avoid recreation on every render:

```javascript
// ✅ Good: Defined once at module scope
const cardStyles = {
  p: 2,
  mb: 3,
  borderRadius: 2,
};

function MyComponent() {
  return <Card sx={cardStyles}>...</Card>;
}
```

```javascript
// ❌ Bad: Created on every render
function MyComponent() {
  return <Card sx={{ p: 2, mb: 3, borderRadius: 2 }}>...</Card>;
}
```

### Theme Variants

For repeated patterns, use theme variants instead of inline sx:

```javascript
// In theme.js
components: {
  MuiButton: {
    variants: [
      {
        props: { variant: 'outlined' },
        style: {
          boxShadow: 'none',
        },
      },
    ],
  },
}
```

### Avoid sx in Hot Lists

Never use dynamic sx objects in lists with many items:

```javascript
// ❌ Bad: Creates new object for each item on every render
{items.map(item => (
  <ListItem sx={{ p: 2, ...(item.selected && { bgcolor: 'action.hover' }) }}>
    {item.name}
  </ListItem>
))}

// ✅ Good: Use className with CSS or styled()
{items.map(item => (
  <ListItem className={item.selected ? 'selected' : ''}>
    {item.name}
  </ListItem>
))}
```

## Theme Configuration

The theme is created once at module scope in `src/theme.js`:

```javascript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    // System fonts for zero network overhead
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },
  // ... rest of theme config
});
```

### System Fonts

We use system fonts to:
- Eliminate font download requests
- Prevent layout shift
- Improve initial render performance
- Match native OS appearance

If custom fonts are required:
- Preload them: `<link rel="preload" as="font" ... />`
- Limit to 1-2 font weights
- Use `font-display: swap`

## Lazy Loading

Heavy components are lazy loaded to reduce initial bundle size:

```javascript
import { lazy, Suspense } from 'react';

// Only loads when actually rendered
const SettingsDialog = lazy(() => import('./SettingsDialog'));

function MyComponent() {
  return (
    <Suspense fallback={<CircularProgress />}>
      {open && <SettingsDialog open={open} onClose={...} />}
    </Suspense>
  );
}
```

### Components to Lazy Load

- Dialog
- Drawer
- DatePicker and advanced pickers
- Rich text editors
- Maps and charts
- Admin-only pages
- Data tables with complex features

## Mobile Optimization

### Performance Tips

1. **Virtualize Long Lists**: Use `react-window` for 100+ items
2. **Memoize List Items**: `React.memo()` + `useCallback()`
3. **Stable Props**: Avoid creating new objects/functions in render
4. **Pagination**: Use "Load More" instead of rendering all items

### Touch Targets

Ensure buttons are at least 44x44px for easy mobile tapping:

```javascript
<Button sx={{ minWidth: 44, minHeight: 44 }}>
  Click
</Button>
```

### Font Sizes

All input fields must have `font-size >= 16px` to prevent iOS zoom:

```javascript
// In theme.js
components: {
  MuiTextField: {
    styleOverrides: {
      root: {
        '& input': {
          fontSize: '16px', // Prevents iOS zoom
        },
      },
    },
  },
}
```

## Production Build

### Vite Build Configuration

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Server Configuration

Enable compression at the server level:

```javascript
// server/index.js
import compression from 'compression';

app.use(compression()); // gzip/brotli compression
```

### Cache Headers

Serve static assets with long cache headers:

```javascript
app.use('/assets', express.static('dist/assets', {
  maxAge: '1y',
  immutable: true,
}));
```

## Bundle Size Management

### Monitoring

Check bundle size after changes:

```bash
npm run build
```

Look for the build output showing chunk sizes.

### Target Sizes

- Initial JS bundle: < 200KB (gzipped)
- Each lazy chunk: < 50KB (gzipped)
- Total CSS: < 50KB (gzipped)

### If Bundle is Too Large

1. Audit imports: `npx vite-bundle-visualizer`
2. Lazy load more components
3. Code split routes
4. Remove unused dependencies
5. Check for duplicate dependencies

## Examples

See live examples at `/mui-examples` route, including:

- Button variants
- Form components
- Lazy loaded dialogs
- Best practices summary

## Quick Checklist

- [ ] Using @mui/material only (no @mui/lab or @mui/icons-material)
- [ ] Path imports for all MUI components
- [ ] Theme created once at module scope
- [ ] CssBaseline included in root
- [ ] System fonts configured
- [ ] Static sx objects for repeated styles
- [ ] Heavy components lazy loaded
- [ ] Production build tested
- [ ] Bundle size verified
- [ ] Mobile performance tested

## Resources

- [MUI Documentation](https://mui.com/)
- [Vite Bundle Optimization](https://vitejs.dev/guide/build.html)
- [React Performance](https://react.dev/learn/render-and-commit)
