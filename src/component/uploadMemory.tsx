import { useState } from "react";
import { db } from "../../lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function UploadMemory() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // Convert image to Base64
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPreview(reader.result as string);
            };
        }
    };

    // Upload Base64 to Firestore
    const handleUpload = async () => {
        if (!selectedFile || !preview) return;

        try {
            await addDoc(collection(db, "memories"), {
                image: preview, // Store Base64 string
                timestamp: new Date(),
            });
            alert("Memory saved successfully!");
            setPreview(null);
            setSelectedFile(null);
        } catch (error) {
            console.error("Error uploading memory:", error);
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" width="200px" />}
            <button onClick={handleUpload}>Upload Memory</button>
        </div>
    );
}
