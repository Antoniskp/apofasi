import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthStatus, logoutUser } from "../lib/api.js";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
} from '@mui/material';

const footerSections = [
  {
    title: "Επικοινωνία",
    titleLink: "/contact",
    links: [
      
      { label: "Συνεργασίες", to: "/contact#collaboration" },
      { label: "Discord", href: "https://discord.gg/pvJftR4T98" }
    ]
  },
  {
    title: "Σχετικά",
    titleLink: "/about",
    links: [
      { label: "Αποστολή", to: "/mission" },
      { label: "Πώς δουλεύουμε", to: "/how-we-do-it" },
      { label: "Η ιστορία μας", to: "/about" },
      { label: "Συνεισφέρετε", to: "/contribute" },
      { label: "Bounties", to: "/bounties" }
    ]
  },
  {
    title: "Τεκμηρίωση",
    titleLink: "/documentation",
    links: [
      { label: "Οδηγός ενημέρωσης", to: "/documentation" },
      { label: "Χάρτης σελίδων", to: "/documentation#sitemap" },
      { label: "DB schema", to: "/documentation#db-schema" },
      { label: "Πού αλλάζουν τα κείμενα", to: "/documentation#content-updates" }
    ]
  },
  {
    title: "Κοινότητα",
    titleLink: "/social",
    links: [
      { label: "Κοινωνικά δίκτυα", to: "/social" },
      { label: "Κανόνες κοινότητας", to: "/community-guidelines" },
      { label: "Συμμετοχή στην ανάπτυξη", to: "/contribute" },
      { label: "Προφίλ χρήστη", to: "/profile" },
      { label: "Σύνδεση", to: "/auth" },
      { label: "Εγγραφή με email", to: "/register" }
    ]
  }
];

export default function Footer() {
  const [authStatus, setAuthStatus] = useState({ loading: true, user: null });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadAuthStatus = async () => {
    try {
      const data = await getAuthStatus();
      setAuthStatus({ loading: false, user: data.user });
    } catch (error) {
      setAuthStatus({ loading: false, user: null });
    }
  };

  useEffect(() => {
    loadAuthStatus();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      await loadAuthStatus();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: 4,
        pb: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '14px',
                  bgcolor: '#0f172a',
                  color: '#facc15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'lowercase',
                }}
              >
                ap
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Apofasi
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Καλύτερες αποφάσεις, μαζί.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ειδήσεις, ψηφοφορίες και εργαλεία για να χτίσουμε μια ενημερωμένη κοινότητα.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: 2,
                bgcolor: '#0f172a',
                color: '#e2e8f0',
                borderRadius: 2,
                border: '1px solid #1f2937',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip 
                  label="Beta" 
                  sx={{ 
                    bgcolor: '#1f2937', 
                    color: '#facc15',
                    fontWeight: 800,
                  }} 
                />
                <Box>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    24/7 ενημέρωση
                  </Typography>
                  <Typography variant="body2">
                    Η πλατφόρμα βρίσκεται σε beta λειτουργία με συνεχή ανανεώσεις περιεχομένου.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {footerSections.map((section) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={section.title}>
              <Paper sx={{ p: 2, height: '100%' }}>
                {section.titleLink ? (
                  <Typography
                    component={Link}
                    to={section.titleLink}
                    variant="h6"
                    sx={{
                      textDecoration: 'none',
                      color: 'text.primary',
                      fontWeight: 600,
                      fontSize: '1rem',
                      mb: 1,
                      display: 'block',
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                  >
                    {section.title}
                  </Typography>
                ) : (
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                    {section.title}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {section.links.map((link) =>
                    link.href ? (
                      <Typography
                        key={link.label}
                        component="a"
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        variant="body2"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {link.label}
                      </Typography>
                    ) : (
                      <Typography
                        key={link.label}
                        component={Link}
                        to={link.to}
                        variant="body2"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {link.label}
                      </Typography>
                    )
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            py: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Apofasi
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Χτισμένο με ανοιχτό κώδικα και φροντίδα.
            </Typography>
            {authStatus.user && (
              <Button
                variant="outlined"
                size="small"
                onClick={handleLogout}
                disabled={authStatus.loading || isLoggingOut}
              >
                {isLoggingOut ? "Αποσύνδεση..." : "Αποσύνδεση"}
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
