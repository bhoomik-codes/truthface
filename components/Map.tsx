"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { User } from '@/types';

// Fix for default leaflet icons in Next.js
const icon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function MapComponent({ users }: { users: User[] }) {
    // Center map on first user or default to Bangalore
    const center = users[0]?.lastLocation
        ? [users[0].lastLocation.lat, users[0].lastLocation.lng] as [number, number]
        : [12.9716, 77.5946] as [number, number];

    return (
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {users.map(user => (
                user.lastLocation && (
                    <Marker
                        key={user.id}
                        position={[user.lastLocation.lat, user.lastLocation.lng]}
                        icon={icon}
                    >
                        <Popup>
                            <div className="font-sans">
                                <strong className="block text-sm">{user.name}</strong>
                                <span className="text-xs text-gray-500">
                                    {new Date(user.lastLocation.timestamp).toLocaleTimeString()}
                                </span>
                                <br />
                                <span className="text-xs text-blue-600">{user.role}</span>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}
