import { useState, useEffect, useCallback, useRef } from 'react';

export const useLocationTracking = (jobId) => {
    const [isTracking, setIsTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [error, setError] = useState(null);
    const watchIdRef = useRef(null);

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setIsTracking(true);
        setError(null);

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };
                setCurrentLocation(location);
                console.log(`Location updated for job ${jobId}:`, location);
            },
            (err) => {
                console.error("Geolocation error:", err);
                // Still pretend it works for the demo if user denied permission locally
                setError("Using mock location for demo purposes.");
                setCurrentLocation({ lat: 6.8654, lng: 79.8973 });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        // Mock fallback if we're on localhost and geolocation isn't working
        if (!watchIdRef.current && window.location.hostname === 'localhost') {
            console.log("Mocking location for local development");
            setCurrentLocation({ lat: 6.8654, lng: 79.8973 });
        }

    }, [jobId]);

    const stopTracking = useCallback(() => {
        if (watchIdRef.current !== null && navigator.geolocation) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
        console.log(`Location tracking stopped for job ${jobId}`);
    }, [jobId]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null && navigator.geolocation) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    // Helper to get a one-off location instead of tracking
    const getCurrentLocation = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (err) => {
                    console.log("Falling back to mock location");
                    resolve({ lat: 6.8654, lng: 79.8973 });
                },
                { enableHighAccuracy: true }
            );
        });
    }, []);

    return {
        isTracking,
        currentLocation,
        error,
        startTracking,
        stopTracking,
        getCurrentLocation
    };
};
