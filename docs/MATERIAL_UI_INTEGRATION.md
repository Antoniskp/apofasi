# Material-UI Integration

## Overview
Material-UI (MUI) has been successfully installed in the Apofasi project. This document provides guidance on using Material-UI components in the application.

## Installed Packages

The following Material-UI packages have been installed:

- `@mui/material` (v7.3.7) - Core Material-UI components
- `@mui/icons-material` (v7.3.7) - Material Design icons
- `@emotion/react` (v11.14.0) - Required peer dependency for styling
- `@emotion/styled` (v11.14.1) - Required peer dependency for styled components

## Current State

### No Tailwind CSS
✅ Confirmed: No Tailwind CSS is present in the project. All styling is currently done with custom CSS.

### Custom CSS with Material Design Principles
The project currently uses custom CSS (`client/src/index.css`) that follows Material Design principles:
- Material Design elevation levels (shadows)
- Material Design transitions and animations
- Material Design color schemes
- Responsive design with mobile-first approach

### Linting Inconsistencies Fixed
✅ All linting issues have been resolved:
- Quote consistency (double quotes)
- React hooks dependencies
- React prop validations
- Escaped entities in JSX

## Using Material-UI

### Basic Usage Example

To use Material-UI components in your React components:

```jsx
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function MyComponent() {
  return (
    <Box sx={{ p: 2 }}>
      <TextField label="Enter text" variant="outlined" />
      <Button variant="contained" startIcon={<AddIcon />}>
        Add Item
      </Button>
    </Box>
  );
}
```

### Common Components Available

- **Buttons**: Button, IconButton, Fab
- **Inputs**: TextField, Select, Checkbox, Radio, Switch
- **Layout**: Box, Container, Grid, Stack, Paper
- **Navigation**: AppBar, Drawer, Menu, Tabs
- **Data Display**: List, Table, Card, Chip, Avatar
- **Feedback**: Alert, Dialog, Snackbar, Progress
- **Icons**: All Material Design icons from @mui/icons-material

### Theming

Material-UI supports theming through the ThemeProvider. To customize the theme:

```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#22375a', // Your custom primary color
    },
    secondary: {
      main: '#facc15', // Your custom secondary color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* Your app components */}
    </ThemeProvider>
  );
}
```

## Migration Strategy (Optional)

If you want to gradually migrate from custom CSS to Material-UI:

1. **Start with new components**: Use Material-UI for any new features
2. **Replace forms**: Material-UI has excellent form components
3. **Modernize layouts**: Use Grid and Box for responsive layouts
4. **Add Material icons**: Replace Font Awesome icons gradually
5. **Keep existing styles**: No need to replace working custom CSS immediately

## Resources

- [Material-UI Documentation](https://mui.com/)
- [Material-UI Components](https://mui.com/material-ui/all-components/)
- [Material Design Icons](https://mui.com/material-ui/material-icons/)
- [Theming Guide](https://mui.com/material-ui/customization/theming/)

## Build and Development

### Development Server
```bash
cd client
npm run dev
```

### Build for Production
```bash
cd client
npm run build
```

### Linting
```bash
cd client
npm run lint
npm run lint:fix  # Auto-fix issues
```

## Notes

- Material-UI components work alongside your existing custom CSS
- The sx prop provides a convenient way to add inline styles with theme support
- Material-UI is tree-shakeable - only imported components are bundled
- All components are accessible and follow WAI-ARIA standards
