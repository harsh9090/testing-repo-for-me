import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebaseConfig";
import { Typography, Card, CardContent, Grid, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhotoAlbumIcon from "@mui/icons-material/PhotoAlbum";
import EventIcon from "@mui/icons-material/Event";
import Link from "next/link";

export default function Dashboard() {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isUnlocked, setIsUnlocked] = useState(false);

    useEffect(() => {
        // Wait for Firebase to load the auth state
       
        const unsubscribe = auth.onAuthStateChanged((user) => {
            
            if (!user) {
                router.push("/");
            }
        });

        return () => unsubscribe(); // Cleanup
    }, [router]);

    useEffect(() => {
        const targetDate = new Date("2025-02-14T00:00:00").getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                setIsUnlocked(true);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
                backgroundSize: "cover",
                padding: 4,
            }}
        >
            {!isUnlocked ? (
                // Countdown Timer Display
                <Box sx={{ textAlign: "center", color: "#fff" }}>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                        Unlocking on **Valentine’s Day 2025** ❤️
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: "bold", textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
                        {timeLeft}
                    </Typography>
                </Box>
            ) : (
                // Dashboard Content (Only Visible After Timer Ends)
                <>
                    <Typography variant="h3" sx={{ fontWeight: "bold", color: "#fff", mb: 2, textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
                        Welcome to Our Love Vault ❤️
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#fff", mb: 4, textAlign: "center" }}>
                        Our love memories stay forever 💖
                    </Typography>

                    <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: "900px" }}>
                        {/* Love Notes */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/love-notes" passHref>
                                <Card
                                    sx={{
                                        background: "rgba(255, 230, 230, 0.9)",
                                        backdropFilter: "blur(10px)",
                                        borderRadius: "15px",
                                        boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                                        textAlign: "center",
                                        transition: "transform 0.3s ease",
                                        cursor: "pointer",
                                        "&:hover": { transform: "scale(1.05)" },
                                    }}
                                >
                                    <CardContent>
                                        <FavoriteIcon color="error" sx={{ fontSize: 50 }} />
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            Love Notes 💌
                                        </Typography>
                                        <Typography>Read personal messages I wrote just for you.</Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>

                        {/* Photo Memories */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/memories" passHref>
                                <Card
                                    sx={{
                                        background: "rgba(255, 230, 230, 0.9)",
                                        backdropFilter: "blur(10px)",
                                        borderRadius: "15px",
                                        boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                                        textAlign: "center",
                                        transition: "transform 0.3s ease",
                                        cursor: "pointer",
                                        "&:hover": { transform: "scale(1.05)" },
                                    }}
                                >
                                    <CardContent>
                                        <PhotoAlbumIcon color="error" sx={{ fontSize: 50 }} />
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            Photo Memories 📸
                                        </Typography>
                                        <Typography>Relive our best moments together.</Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>

                        {/* Special Dates */}
                        <Grid item xs={12} sm={6} md={4}>
                            <Link href="/important-dates" passHref>
                                <Card
                                    sx={{
                                        background: "rgba(255, 230, 230, 0.9)",
                                        backdropFilter: "blur(10px)",
                                        borderRadius: "15px",
                                        boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                                        textAlign: "center",
                                        transition: "transform 0.3s ease",
                                        cursor: "pointer",
                                        "&:hover": { transform: "scale(1.05)" },
                                    }}
                                >
                                    <CardContent>
                                        <EventIcon color="error" sx={{ fontSize: 50 }} />
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            Cherished Moments 💕
                                        </Typography>
                                        <Typography>See our special moments and upcoming anniversaries.</Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    </Grid>
                </>
            )}
        </Box>
    );
}
