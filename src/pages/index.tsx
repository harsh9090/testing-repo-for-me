import { useState } from "react";
import { useRouter } from "next/router";
import { auth, signInWithEmailAndPassword } from "../../lib/firebaseConfig";
import { TextField, Button, Container, Typography, Paper, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function LoginPage() {
  const [memory, setMemory] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const isCloseGuess = (input: string) => {
    const formattedInput = input.trim().toLowerCase();

    return (
      formattedInput.includes("22 july") ||
      formattedInput.includes("22 jul") ||
      formattedInput.includes("jul 22") ||
      formattedInput.includes("july 22") ||
      formattedInput.includes("07-22-2017") ||
      formattedInput.includes("22-07-2017") ||
      formattedInput.includes("22/07/2017") ||
      formattedInput.includes("22.07.2017") ||
      formattedInput.includes("2017-07-22") ||
      formattedInput.includes("2017/07/22")
    );
  };
  const handleLogin = async () => {
    const email = "testing@gmail.com"; // Her email
    if (!isCloseGuess(memory)) {
      setError("Oops! Wrong memory. Try again ❤️");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, "testing");
      router.push("/dashboard"); // Redirect to vault
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error logging in:", error.message);
        setError("Oops! Wrong memory. Try again ❤️");
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred. Try again ❤️");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "url('/loveImg.webp') center/cover no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            textAlign: "center",
            bgcolor: "rgba(255, 230, 230, 0.9)", // Soft pink with slight transparency
            borderRadius: "15px",
          }}
        >
          <FavoriteIcon color="error" sx={{ fontSize: 50 }} />
          <Typography variant="h5" gutterBottom>
            Unlock Love Vault with the special date💖
          </Typography>
          <TextField
            fullWidth
            label="Enter the special memory..."
            variant="outlined"
            value={memory}
            onChange={(e) => setMemory(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="error" fullWidth onClick={handleLogin}>
            Unlock ❤️
          </Button>
          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        </Paper>
      </Container>
    </Box>
  );
}
