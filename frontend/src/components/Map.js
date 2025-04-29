import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ selectedParcels, setSelectedParcels, selectedParcelInfo, setSelectedParcelInfo, parcels, darkMode, setZoningType }) => {
    
    const [autoMove, setAutoMove]= useState(true);

    const parcelSelect = (parcelId) => {
        // Deselecting a parcel
        if (selectedParcels.includes(parcelId)) { 
            const updatedSelectedParcels = selectedParcels.filter(id => id !== parcelId);

            // Still have remaining selected parcels
            if (updatedSelectedParcels.length > 0) { 
                const lastSelectedId = updatedSelectedParcels[updatedSelectedParcels.length - 1];
                const lastSelected = parcels.find(p => p.id === lastSelectedId);
                if (lastSelected) {
                    const center = lastSelected.coordinates[Math.floor(lastSelected.coordinates.length / 2)];
                    setSelectedParcelInfo({
                        latitude: center[0],
                        longitude: center[1],
                        zoningType: lastSelected.zoningType,
                        area: lastSelected.area || 0,
                        address: lastSelected.fullAddress,
                        usedesc: lastSelected.usedesc
                    });
                }
                // No parcels selected left
            } else { 
                setSelectedParcelInfo(null);
                setZoningType(null);
            }

            setSelectedParcels(updatedSelectedParcels);
        } else { // Selecting a new parcel
            const selected = parcels.find(p => p.id === parcelId);
            // Only change zoning type if it's the first selected. For usability
            if(selectedParcels.length === 0){
                setZoningType(selected.zoningType);
            }
            const centerPoint = selected.coordinates[Math.floor(selected.coordinates.length / 2)];
            setSelectedParcelInfo({
                latitude: centerPoint[0],
                longitude: centerPoint[1],
                zoningType: selected.zoningType,
                area: selected.area || 0,
                address: selected.fullAddress,
                usedesc: selected.usedesc
            });
            
            setSelectedParcels(prev => [...prev, parcelId]);
        }
    };
    
    const FlyToParcel = ({ center }) => {
        const map = useMap();
        if(center) {
            map.flyTo(center, 17, {
                duration: 1.5
            });
        }
        return null;
    };

    return (
        <div className="w-full h-full">
            <MapContainer className="h-full w-full" center={[32.964713, -96.791278]} zoom={15}>
                <TileLayer
                    url={darkMode
                        ? `https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=${process.env.REACT_APP_MAPTILER_KEY}`
                        : `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
                    }
                />

                <div className="absolute bottom-4 left-4 z-[9999]">
                    <button
                        onClick={() => setAutoMove(prev => !prev)}
                        className={`px-3 py-2 rounded-lg shadow-md text-sm font-semibold transition duration-300 ease-in-out transform hover:scale-105 
                        ${autoMove 
                            ? 'bg-green-500 text-black hover:bg-green-700' 
                            : 'bg-red-500 text-black hover:bg-red-700'}
                        `}
                    >
                        Auto-Move: {autoMove ? 'ON' : 'OFF'}
                    </button>
                </div>

                {autoMove && selectedParcelInfo && (
                    <FlyToParcel center={[selectedParcelInfo.latitude, selectedParcelInfo.longitude]} />
                )}

                {parcels.map(parcel => (
                    <Polygon
                        key={parcel.id}
                        positions={parcel.coordinates}
                        pathOptions={{
                            color: selectedParcels.includes(parcel.id) 
                                ? 'blue' 
                                : (darkMode ? '#87CEEB' : 'gray'),
                            weight: 2
                        }}
                        eventHandlers={{
                            click: () => parcelSelect(parcel.id),
                            mouseover: (e) => {
                                e.target.setStyle({
                                    weight: 4,
                                    color: 'orange',
                                });
                                },
                                mouseout: (e) => {
                                e.target.setStyle({
                                    weight: 2,
                                    color: selectedParcels.includes(parcel.id) 
                                        ? 'blue' 
                                        : (darkMode ? '#87CEEB' : 'gray'),
                                });
                                }
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    )
}

export default Map
