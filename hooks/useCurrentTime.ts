import { useState, useEffect } from 'react';

export const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState<string>("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
            setCurrentTime(timeString);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return currentTime;
};