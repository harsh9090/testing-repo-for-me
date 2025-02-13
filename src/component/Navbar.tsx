import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/router";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { auth, signOut } from "../../lib/firebaseConfig";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        const targetDate = new Date("2025-02-14T00:00:00").getTime();
        const now = new Date().getTime();
        if (now >= targetDate) {
            setIsUnlocked(true); // Unlock buttons after 14th Feb
        }
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    return (
        <Box sx={{ background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)" }}>
            <AppBar
                position="fixed"
                sx={{
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "none",
                    padding: "8px 0",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Logo / App Name */}
                    <Box display="flex" alignItems="center">
                        <FavoriteIcon sx={{ color: "red", fontSize: 30, mr: 1 }} />
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: "bold", color: "#fff", textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}
                        >
                            Love Vault 💖
                        </Typography>
                    </Box>

                    {/* Navigation Links (Hidden Before Feb 14) */}
                    {isUnlocked && (
                        <Box>
                            <Button component={Link} href="/dashboard" sx={navButtonStyles}>
                                Dashboard
                            </Button>
                            <Button component={Link} href="/love-notes" sx={navButtonStyles}>
                                Love Notes 💌
                            </Button>
                            <Button component={Link} href="/memories" sx={navButtonStyles}>
                                Memories 📸
                            </Button>
                            <Button component={Link} href="/important-dates" sx={navButtonStyles}>
                                Cherished Moments 💕
                            </Button>
                        </Box>
                    )}

                    {/* Logout Button (Always Visible) */}
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<LogoutIcon />}
                        sx={{
                            fontSize: "14px",
                            boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                            "&:hover": { transform: "scale(1.05)", backgroundColor: "#e63946" },
                        }}
                        onClick={handleLogout}
                    >
                        Logout 💔
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

// Custom styles for navigation buttons
const navButtonStyles = {
    color: "#fff",
    fontWeight: "bold",
    mx: 1,
    transition: "transform 0.2s ease",
    "&:hover": { transform: "scale(1.05)", color: "#ffebee" },
};
