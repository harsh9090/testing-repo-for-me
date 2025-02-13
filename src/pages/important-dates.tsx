import { Container, Typography, Grid, Card, CardContent, Box, Button, TextField, Modal, Fab } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import CountdownTimer from "@/component/countDown";

export default function ImportantDates() {
    const [events, setEvents] = useState<{ title: string; date: string }[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const router = useRouter();

    // Fetch events from Firebase
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                router.push("/"); // Redirect if not authenticated
            } else {
                fetchEvents();
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchEvents = async () => {
        const querySnapshot = await getDocs(collection(db, "importantDates"));
        const eventList = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
        })) as { title: string; date: string }[];

        setEvents(eventList);
    };

   

    const handleAddEvent = async () => {
        if (!newTitle || !newDate) return;

        const newEvent = { title: newTitle, date: newDate };
        await addDoc(collection(db, "importantDates"), newEvent);
        setEvents([...events, newEvent]);
        setOpenModal(false);
        setNewTitle("");
        setNewDate("");
    };

    


    return (
        <Box
            sx={{
                minHeight: "100vh",
                paddingTop: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                background: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
                // padding: 4,
            }}
        >
            {/* Header */}
            <Typography variant="h3" sx={{ color: "#fff", mb: 4, textShadow: "2px 2px 10px rgba(0,0,0,0.3)" }}>
                Memories That Matter ❤️
            </Typography>

            {/* Display Events */}
            <Container maxWidth="md">
                <Grid container spacing={2} justifyContent="center">
                    {events.map((event, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    background: "rgba(255, 230, 230, 0.9)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: "15px",
                                    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                                    textAlign: "center",
                                    padding: "15px",
                                    transition: "transform 0.3s ease",
                                    "&:hover": { transform: "scale(1.05)" },
                                }}
                            >
                                <CardContent>
                                    <EventIcon color="error" sx={{ fontSize: 50 }} />
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        {event.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: "18px", mt: 1, fontWeight: "bold" }}>
                                        {new Date(event.date).toDateString()}
                                    </Typography>
                                    <Typography sx={{ fontSize: "16px", mt: 1, color: "#e63946", fontWeight: "bold" }}>
                                        {/* {new Date(event.date).toDateString()} */}
                                        <CountdownTimer date={event.date} />
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Floating Button for Adding Event */}
            <Fab
                color="error"
                sx={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    backgroundColor: "#ff5252",
                    "&:hover": { backgroundColor: "#e63946" },
                }}
                onClick={() => setOpenModal(true)}
            >
                <AddIcon />
            </Fab>

            {/* Modal to Add Event */}
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: 4,
                        boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                        minWidth: "300px",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                        Add Special moment
                    </Typography>
                    <TextField
                        fullWidth
                        label="Event Title"
                        variant="outlined"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        variant="outlined"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="error" onClick={handleAddEvent}>
                        Save
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}
