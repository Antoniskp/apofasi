import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthStatus, logoutUser } from "../lib/api.js";
import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import BalanceIcon from "@mui/icons-material/Balance";

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
      { label: "Κανόνες κοινότητας", to: "/community-guidelines" },
      { label: "Συμμετοχή στην ανάπτυξη", to: "/contribute" },
      { label: "Προφίλ χρήστη", to: "/profile" },
      { label: "Σύνδεση", to: "/auth" },
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
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Brand section */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    bgcolor: "#0f172a",
                    color: "#facc15",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.14)",
                  }}
                >
                  <BalanceIcon />
                </Box>
                <Box>
                  <Typography variant="overline" sx={{ fontWeight: 700, lineHeight: 1 }}>
                    Απόφαση
                  </Typography>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    Καλύτερες αποφάσεις, μαζί.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Ειδήσεις, ψηφοφορίες και εργαλεία για να χτίσουμε μια ενημερωμένη κοινότητα.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Beta status */}
            <Box sx={{ flex: 1 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  bgcolor: "#0f172a",
                  color: "#e2e8f0",
                  borderRadius: 2,
                  border: "1px solid #1f2937",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Chip
                    label="Beta"
                    sx={{
                      bgcolor: "#1f2937",
                      color: "#facc15",
                      fontWeight: 800,
                      fontSize: "0.75rem",
                    }}
                  />
                  <Box>
                    <Typography variant="overline" sx={{ fontWeight: 700, lineHeight: 1 }}>
                      24/7 ενημέρωση από εσένα
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                      Η πλατφόρμα βρίσκεται σε δοκιμαστική λειτουργία με συνεχείς ανανεώσεις περιεχομένου.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Stack>

        {/* Footer links grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
            gap: 2,
            mb: 2,
          }}
        >
          {footerSections.map((section) => (
            <Paper
              key={section.title}
              elevation={1}
              sx={{
                p: 2,
                bgcolor: "#fff",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
              }}
            >
              {section.titleLink ? (
                <Typography
                  component={Link}
                  to={section.titleLink}
                  variant="h6"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    mb: 1,
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  {section.title}
                </Typography>
              ) : (
                <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: 700, mb: 1 }}>
                  {section.title}
                </Typography>
              )}
              <Stack spacing={0.5}>
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
                        color: "primary.main",
                        fontWeight: 700,
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        "&:hover": {
                          textDecoration: "underline",
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
                        color: "primary.main",
                        fontWeight: 700,
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {link.label}
                    </Typography>
                  )
                )}
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* Footer bottom */}
        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Aπofasi
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
