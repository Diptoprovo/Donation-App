import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { useApp } from '../context/AppContext';
import L from 'leaflet';

import markerIcon from '../assets/location-pin.png'; // Adjust the path to your marker icon

const AllStatsMapRender = () => {

    //gotta make a backend to fetch all x y of donor and recv
    const { api } = useApp();
    const [posList, setPosList] = useState([]);
    const [rposList, setRPosList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data } = await api.get("/stats/xy");;
                console.log(data);
                if (data.success) {
                    const validDonors = data.donors.filter(donor => donor.x && donor.y);
                    const validReceivers = data.receiver.filter(receiver => receiver.x && receiver.y);

                    console.log("Filtered Donors:", validDonors); // Log filtered donors
                    console.log("Filtered Receivers:", validReceivers); // Log filtered receivers
                    setPosList(validDonors);
                    setRPosList(validReceivers);
                } else {
                    console.error("Failed to fetch data:", data.message);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const customIcon = L.icon({
        iconUrl: markerIcon, // You can use any custom image or color here
        iconSize: [35, 41], // Size of the icon
        iconAnchor: [12, 41], // Position of the icon
        popupAnchor: [1, -34] // Position of the popup
    });
    // useEffect(() => {
    //     console.log("Updated posList:", posList);
    // }, [posList]);

    return (
        <div className='my-3'>
            {!isLoading && (
                <MapContainer center={[22.57, 88.36]} zoom={13} style={{ height: '70vh', width: '100%',border: '2px solid #D3D3D3', borderRadius: '15px',  // Adjust the radius as needed
                    overflow: 'hidden' }}
                >
                    <TileLayer
                        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        
                    />

                    {posList.map(( donor,idx) => {
                        if (!donor.x || !donor.y){console.log("Skipping", donor); return null;} // Skip invalid data
                        else console.log("Valid donor", donor,idx);
                        return (
                            <Marker key={idx} position={[donor.x, donor.y]}>
                                <Popup>I am a Donor</Popup>
                            </Marker>
                        );
                    })}
                    {rposList.map(( donor,idx) => {
                        if (!donor.x || !donor.y){console.log("Skipping", donor); return null;} // Skip invalid data
                        else console.log("Valid donor", donor,idx);
                        return (
                            <Marker key={idx} position={[donor.x, donor.y]} icon={customIcon}>
                                <Popup>I am a receiver</Popup>
                            </Marker>
                        );
                    })}

                </MapContainer>
            )}
        </div>
    );

}

export default AllStatsMapRender
