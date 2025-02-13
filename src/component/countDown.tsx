import { useState, useEffect } from "react";

// Function to calculate the countdown dynamically
const getTimeLeft = (date: string) => {
    const now = new Date();
    const eventDate = new Date(date);

    // Set event date to the current year
    eventDate.setFullYear(now.getFullYear());

    // If the event date has already passed this year, move it to next year
    if (eventDate.getTime() < now.getTime()) {
        eventDate.setFullYear(now.getFullYear() + 1);
    }

    const difference = eventDate.getTime() - now.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

export default function CountdownTimer({ date }: { date: string }) {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(date));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(date));
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [date]);

    return <span>{timeLeft}</span>;
}
