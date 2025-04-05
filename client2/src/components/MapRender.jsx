import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { useApp } from '../context/AppContext';
const MapRender = () => {

    const { setCoords } = useApp();
    const [position, setPosition] = useState(null)

    function LocationMarker() {
        const map = useMapEvents({
            click(e) {
                const latlng = e.latlng;
                console.log(latlng);
                setPosition(latlng);
                setCoords(latlng.lat, latlng.lng)
            },
        })



        return position === null ? null : (
            <Marker position={position}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }

    return (
        <div className='my-3 border border-amber-700'>
            <MapContainer center={[22.57, 88.36]} zoom={13} style={{ height: '20vh', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationMarker />
            </MapContainer>
        </div>
    );
}

export default MapRender
