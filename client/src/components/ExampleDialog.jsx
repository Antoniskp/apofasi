// Best Practice #6: Heavy component that's lazy loaded
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ExampleDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lazy Loaded Dialog</DialogTitle>
      <DialogContent>
        <Typography variant="body1" paragraph>
          This dialog component is lazy loaded using React.lazy() and Suspense.
          It&apos;s only downloaded when the user clicks the &quot;Open Dialog&quot; button,
          keeping the initial bundle size smaller.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is especially important for mobile users on slower networks.
          Heavy components like Dialogs, Drawers, date pickers, charts, and
          admin panels should be lazy loaded.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
}
