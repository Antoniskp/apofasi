# Converting Existing Components to MUI Best Practices

This guide shows how to gradually adopt MUI in existing components while following performance best practices.

## Example: Footer Component Migration

### Before (Custom CSS)

```jsx
<button
  type="button"
  className="btn btn-outline footer-logout"
  onClick={handleLogout}
  disabled={isLoggingOut}
>
  {isLoggingOut ? "Αποσύνδεση..." : "Αποσύνδεση"}
</button>
```

### After (MUI with Best Practices)

```jsx
// Path import (tree-shaking friendly)
import Button from "@mui/material/Button";

// Static sx object outside component
const logoutButtonStyles = {
  minHeight: 44, // Mobile-friendly touch target
};

// In component
<Button
  variant="outlined"
  onClick={handleLogout}
  disabled={isLoggingOut}
  sx={logoutButtonStyles}
>
  {isLoggingOut ? "Αποσύνδεση..." : "Αποσύνδεση"}
</Button>
```

## Migration Strategy

### 1. Start Small
- Begin with simple components (buttons, text fields)
- Don't try to convert everything at once
- Test each conversion thoroughly

### 2. Keep Custom CSS When Needed
- MUI doesn't replace all custom CSS
- Keep your existing layout classes
- Only replace components that benefit from MUI
- Mix MUI with custom CSS is perfectly fine

### 3. Prioritize High-Impact Areas
Convert components in this order:
1. Forms and input fields
2. Buttons and actions
3. Cards and containers
4. Navigation (if needed)
5. Data display components

### 4. Use Theme Consistently
```jsx
// Access theme values in sx
sx={{
  color: 'primary.main',      // Theme color
  bgcolor: 'background.paper', // Theme background
  borderRadius: 1,             // Theme shape
}}
```

## Common Patterns

### Buttons
```jsx
import Button from "@mui/material/Button";

// Primary action
<Button variant="contained" color="primary">
  Submit
</Button>

// Secondary action
<Button variant="outlined" color="primary">
  Cancel
</Button>

// Tertiary action
<Button variant="text" color="primary">
  Learn More
</Button>
```

### Text Fields
```jsx
import TextField from "@mui/material/TextField";

<TextField
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  fullWidth
  // Mobile-friendly: font-size >= 16px set in theme
/>
```

### Cards
```jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

<Card>
  <CardContent>
    <Typography variant="h5" component="h2" gutterBottom>
      Card Title
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Card content goes here
    </Typography>
  </CardContent>
</Card>
```

### Layout Containers
```jsx
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

<Container maxWidth="lg">
  <Box sx={{ py: 4 }}>
    {/* Content */}
  </Box>
</Container>
```

## Performance Tips During Migration

### 1. Use Memoization for List Items
```jsx
import { memo } from "react";

const ListItem = memo(function ListItem({ item }) {
  return (
    <Card>
      {/* Item content */}
    </Card>
  );
});
```

### 2. Lazy Load Heavy MUI Components
```jsx
import { lazy, Suspense } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const DataTable = lazy(() => import("./DataTable"));

function MyComponent() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <DataTable data={data} />
    </Suspense>
  );
}
```

### 3. Avoid Inline sx in Lists
```jsx
// ❌ Bad: Creates new object every render for each item
{items.map(item => (
  <Card key={item.id} sx={{ p: 2, mb: 1 }}>
    {item.name}
  </Card>
))}

// ✅ Good: Reuse static object
const cardStyles = { p: 2, mb: 1 };

{items.map(item => (
  <Card key={item.id} sx={cardStyles}>
    {item.name}
  </Card>
))}
```

## Gradual Adoption Checklist

- [ ] Add MUI to project (✅ Done)
- [ ] Create theme configuration (✅ Done)
- [ ] Setup providers (✅ Done)
- [ ] Convert one component as proof of concept
- [ ] Measure bundle size impact
- [ ] Convert forms and inputs
- [ ] Convert buttons and actions
- [ ] Convert cards and containers
- [ ] Test mobile performance
- [ ] Monitor bundle size throughout

## When NOT to Use MUI

Sometimes custom CSS is better:
- Simple static layouts
- Unique custom designs
- Components that don't benefit from theming
- When bundle size is critical and MUI adds too much

## Best of Both Worlds

You can mix MUI components with custom CSS:

```jsx
<div className="custom-layout">
  <Button variant="contained">MUI Button</Button>
  <div className="custom-card">
    <Typography variant="body1">MUI Typography</Typography>
  </div>
</div>
```

This approach:
- Keeps your existing CSS
- Adds MUI where it helps
- Maintains performance
- Allows gradual migration
