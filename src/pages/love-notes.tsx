import { Container, Typography, Box, Button, Modal, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../../lib/firebaseConfig"; // Firebase setup
import { collection, getDocs,  query } from "firebase/firestore";

export default function LoveNotes() {
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [loveMessages, setLoveMessages] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {

        // Check if the user is authenticated & fetch love notes
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/"); // Redirect if not logged in
            } else {
                setLoading(false);
                fetchLoveNotes();
            }
        });

        return () => unsubscribe(); // Cleanup Firebase listener
    }, [router]);

    // Fetch Love Notes from Firestore
    const fetchLoveNotes = async () => {
        try {
            const q = query(collection(db, "loveNotes"));
            const querySnapshot = await getDocs(q);
            const notes = querySnapshot.docs.map((doc) => doc.data().message) as string[];
            setLoveMessages(notes);
        } catch (error) {
            console.error("Error fetching love notes:", error);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h5">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
                padding: 4,
            }}
        >
            <Typography variant="h3" sx={{ color: "#fff", mb: 4, textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
                Love Notes 💌
            </Typography>

            {/* Love Notes Grid */}
            <Container maxWidth="md">
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 3, justifyContent: "center" }}>
                    {loveMessages.map((message, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                width: "120px",
                                height: "120px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(255, 230, 230, 0.9)",
                                borderRadius: "10px",
                                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                                cursor: "pointer",
                            }}
                            onClick={() => setSelectedMessage(message)}
                        >
                            <FavoriteIcon color="error" sx={{ fontSize: 40 }} />
                        </motion.div>
                    ))}
                </Box>
            </Container>

            {/* Letter Modal */}
            <Modal
                open={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: "url('/letter.webp') center/cover no-repeat",
                        borderRadius: "10px",
                        padding: "20px",
                        textAlign: "center",
                        maxWidth: "400px",
                        minWidth: "300px",
                        boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <IconButton
                        onClick={() => setSelectedMessage(null)}
                        sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography
                        variant="h5"
                        sx={{
                            fontFamily: "'Dancing Script', cursive",
                            color: "#6D4C41",
                            fontWeight: "bold",
                            mt: 2,
                            px: 2,
                        }}
                    >
                        {selectedMessage}
                    </Typography>
                    {/* Wax Seal at the Bottom */}
                    <Box
                        sx={{
                            width: "50px",
                            height: "50px",
                            background: "red",
                            borderRadius: "50%",
                            boxShadow: "inset 0px 0px 10px rgba(0,0,0,0.3)",
                            mt: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ❤️
                    </Box>
                </motion.div>
            </Modal>

            {/* Return Button */}
            <Button
                variant="contained"
                color="error"
                startIcon={<ArrowBackIcon />}
                sx={{
                    mt: 4,
                    fontSize: "16px",
                    padding: "10px 20px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.05)", backgroundColor: "#e63946" },
                }}
                onClick={() => router.push("/dashboard")}
            >
                Return to Dashboard
            </Button>
        </Box>
    );
}
