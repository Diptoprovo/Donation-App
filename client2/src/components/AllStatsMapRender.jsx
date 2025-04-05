import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { useApp } from '../context/AppContext';

const AllStatsMapRender = () => {

    //gotta make a backend to fetch all x y of donor and recv


    const [posList, setPosList] = useState([]);
    return (
        <div className='my-3 border border-amber-700'>
            <MapContainer center={[22.57, 88.36]} zoom={13} style={{ height: '20vh', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {posList.map((pos, idx) => (
                    <Marker key={idx} position={pos}>
                        <Popup>Here</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );

}

export default AllStatsMapRender
