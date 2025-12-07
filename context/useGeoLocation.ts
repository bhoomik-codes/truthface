import { useState, useEffect } from 'react';

export const useGeoLocation = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number; error?: string } | null>(null);

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev!, lat: 0, lng: 0, error: "Geolocation not supported" }));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                setLocation(prev => ({ ...prev!, lat: 0, lng: 0, error: error.message }));
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    return { location, refreshLocation: getCurrentLocation };
};
