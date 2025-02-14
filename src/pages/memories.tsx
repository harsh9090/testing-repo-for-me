import { Container, Typography, Grid, Card, CardMedia, Box, Button, Modal, IconButton } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../../lib/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import imageCompression from "browser-image-compression";

export default function Memories() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/"); // Redirect if not authenticated
            } else {
                setLoading(false);
                fetchMemories();
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Fetch images from Firestore
    const fetchMemories = async () => {
        const querySnapshot = await getDocs(collection(db, "memories"));
        const images = querySnapshot.docs.map((doc) => doc.data().image); // Get Base64 images
        const messages = querySnapshot.docs.map((doc) => doc.data().message); // Get Base64 images
        setPhotos(images);
        setMessages(messages);
    };
    const [messages, setMessages] = useState<string[]>([]);
    // Handle image upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            // setPreviewImage(URL.createObjectURL(event.target.files[0]));
        }
    };
    const [message, setMessage] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!selectedFile) return;

        // 👉 Convert compressed image to Base64

        try {
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800, useWebWorker: true };
            const compressedFile = await imageCompression(selectedFile, options);

            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);

            reader.onload = async () => {
                const base64Image = reader.result as string;

                try {
                    await addDoc(collection(db, "memories"), {
                        image: base64Image,
                        timestamp: new Date(),
                        message: message || "", // Ensure message is always defined
                    });

                    setPhotos((prevPhotos) => [...prevPhotos, base64Image]);
                    setOpenModal(false);
                    setSelectedFile(null);
                } catch (error) {
                    console.error("Error adding document:", error);
                }
            };

            reader.onerror = (error) => {
                console.error("Error reading file:", error);
            };
        } catch (error) {
            console.error("Error uploading image:", error);
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
            {/* Page Header */}
            <Typography variant="h3" sx={{ color: "#fff", mb: 2, textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
                Our Beautiful Memories 📸
            </Typography>

            {/* Add New Memory Button */}
            <Button
                variant="contained"
                startIcon={<AddAPhotoIcon />}
                sx={{
                    backgroundColor: "#ff5252",
                    mb: 4,
                    "&:hover": { backgroundColor: "#e63946" },
                }}
                onClick={() => {
                    setOpenModal(true);
                    setMessage(null);
                }}
            >
                Add New Memory
            </Button>

            {/* Memories Grid */}
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    {photos.map((photo, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                style={{ position: "relative" }} // Ensures message overlay is properly positioned
                            >
                                <Card
                                    sx={{
                                        borderRadius: "15px",
                                        overflow: "hidden",
                                        boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                                        position: "relative", // Important for absolute positioning of message
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={photo}
                                        alt={`Memory ${index + 1}`}
                                        sx={{ width: "100%", height: "auto" }}
                                    />

                                    {/* Message overlay, initially hidden and appears on hover */}
                                    {messages[index] && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                width: "100%",
                                                background: "rgba(0,0,0,0.5)",
                                                color: "white",
                                                textAlign: "center",
                                                padding: "10px",
                                                opacity: 0, // Ensures it's hidden when not hovered
                                            }}
                                        >
                                            {messages[index]}
                                        </motion.div>
                                    )}
                                </Card>
                            </motion.div>
                        </Grid>

                    ))}
                </Grid>
            </Container>

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

            {/* Upload Modal */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: 4,
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                        minWidth: "300px",
                        textAlign: "center",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    <IconButton
                        onClick={() => setOpenModal(false)}
                        sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                        Upload New Memory
                    </Typography>
                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                        Upload New Memory
                    </Typography>
                    <input type="text" onChange={(e) => setMessage(e.target.value)} style={{ marginBottom: "10px" }} />

                    <Button variant="contained" color="error" onClick={handleUpload}>
                        Upload
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
