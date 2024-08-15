import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const routePath = [
    [37.772, -122.214],
    [21.291, -157.821],
    [-18.142, 178.431],
    [-27.467, 153.027],
];

const icon = new L.Icon({
    iconUrl: "https://img.icons8.com/color/48/000000/car.png",
    iconSize: [32, 32],
});

const interpolatePosition = (start, end, t) => [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
];

const MapComponent = () => {
    const [currentPosition, setCurrentPosition] = useState(routePath[0]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + 0.01;
                if (newProgress >= 1) {
                    setCurrentIndex((prevIndex) => {
                        const newIndex = (prevIndex + 1) % routePath.length;
                        setCurrentPosition(routePath[newIndex]);
                        return newIndex;
                    });
                    return 0;
                } else {
                    setCurrentPosition(interpolatePosition(routePath[currentIndex], routePath[(currentIndex + 1) % routePath.length], newProgress));
                    return newProgress;
                }
            });
        }, 100); // Update every 100 milliseconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <MapContainer center={currentPosition} zoom={6} style={{ height: '100vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={currentPosition} icon={icon} />
            <Polyline positions={routePath} color="red" />
        </MapContainer>
    );
};

export default MapComponent;
