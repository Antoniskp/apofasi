import { useState, lazy, Suspense } from "react";
// Best Practice #2: Tree-shaking friendly path imports
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// Best Practice #6: Lazy load heavy components (Dialog, Drawer)
const ExampleDialog = lazy(() => import("../components/ExampleDialog.jsx"));

// Best Practice #3B: Static sx objects defined outside component
const containerStyles = {
  py: 4,
  px: 2,
};

const cardStyles = {
  mb: 3,
  p: 2,
};

const buttonGroupStyles = {
  display: "flex",
  gap: 2,
  flexWrap: "wrap",
  mt: 2,
};

export default function MuiExamples() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Container maxWidth="lg" sx={containerStyles}>
      <Typography variant="h3" component="h1" gutterBottom color="primary">
        MUI Best Practices Examples
      </Typography>
      
      <Typography variant="body1" paragraph color="text.secondary">
        This page demonstrates Material-UI implementation following performance best practices
        for lightweight, mobile-optimized React applications.
      </Typography>

      {/* Example 1: Buttons with variants */}
      <Card sx={cardStyles}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            1. Button Components (No Icon Bloat)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Using MUI buttons without @mui/icons-material to keep bundle size small.
          </Typography>
          <Box sx={buttonGroupStyles}>
            <Button variant="contained" color="primary">
              Primary Button
            </Button>
            <Button variant="outlined" color="primary">
              Outlined Button
            </Button>
            <Button variant="text" color="primary">
              Text Button
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Example 2: Form with TextField */}
      <Card sx={cardStyles}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            2. Form Fields (Static sx Objects)
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Using static sx objects defined outside component to reduce runtime overhead.
          </Typography>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleChange("name")}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              fullWidth
            />
            <Button variant="contained" color="primary" type="button">
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Example 3: Lazy loaded Dialog */}
      <Card sx={cardStyles}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            3. Lazy Loaded Dialog
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Dialog component is lazy loaded to reduce initial bundle size. Code only loads when needed.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => setDialogOpen(true)}
          >
            Open Dialog
          </Button>
        </CardContent>
      </Card>

      {/* Example 4: Best Practices Summary */}
      <Card sx={cardStyles}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            4. Performance Best Practices Applied
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>✅ Tree-shaking friendly path imports (import Button from &apos;@mui/material/Button&apos;)</li>
            <li>✅ Single theme created at module scope (theme.js)</li>
            <li>✅ System fonts for zero network overhead</li>
            <li>✅ CssBaseline for consistent global styles</li>
            <li>✅ Static sx objects to reduce runtime overhead</li>
            <li>✅ Lazy loading for heavy components (Dialog, Drawer)</li>
            <li>✅ No @mui/icons-material (reduces bundle size)</li>
            <li>✅ Production build with Vite optimizations</li>
          </Box>
        </CardContent>
      </Card>

      {/* Lazy loaded Dialog with Suspense fallback */}
      {dialogOpen && (
        <Suspense fallback={<CircularProgress />}>
          <ExampleDialog 
            open={dialogOpen} 
            onClose={() => setDialogOpen(false)} 
          />
        </Suspense>
      )}
    </Container>
  );
}
