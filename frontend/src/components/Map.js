import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ selectedParcels, setSelectedParcels, selectedParcelInfo, setSelectedParcelInfo, parcels, darkMode, setZoningType }) => {
    
    const [autoMove, setAutoMove]= useState(true);
    const [hoveredParcelInfo, setHoveredParcelInfo] = useState(null);
    const [hoveredParcelId, setHoveredParcelId] = useState(null);
    const [flyToTarget, setFlyToTarget] = useState(false);

    // When user clicks on a parcel
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
        // Selecting a new parcel
        } else {
            setFlyToTarget(true);
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
    
    // Fly To Functionality
    const FlyToParcel = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            if (flyToTarget && center) {
                map.flyTo(center, 17, { duration: 1 });
                setFlyToTarget(false);
            }
        }, [center, flyToTarget, map]);
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
                                : hoveredParcelId === parcel.id
                                ? 'orange'
                                : (darkMode ? '#87CEEB' : 'gray'),
                            weight: hoveredParcelId === parcel.id ? 4 : 2
                        }}
                        eventHandlers={{
                            click: () => parcelSelect(parcel.id),
                            mouseover: (e) => {
                                const center = parcel.coordinates[Math.floor(parcel.coordinates.length / 2)];
                                setHoveredParcelInfo({
                                    id: parcel.id,
                                    zoningType: parcel.zoningType,
                                    area: parcel.area,
                                    center: center,
                                });
                                setHoveredParcelId(parcel.id);
                            },
                            mouseout: (e) => {
                                setHoveredParcelInfo(null);
                                setHoveredParcelId(null);
                            }
                        }}
                    />
                ))}
                {hoveredParcelInfo && (
                    <div
                    className={`absolute z-[9999] p-2 rounded-lg shadow-md text-sm font-semibold transition duration-300 transform pointer-events-none
                        ${darkMode ? 'bg-gray-800 text-white border border-gray-600' : 'bg-white text-black border border-gray-200'}
                      `}
                        style={{
                            left: `50%`,
                            top: `1%`,
                        }}
                    >
                        <div>Parcel ID: {hoveredParcelInfo.id}</div>
                        <div>Zoning: {hoveredParcelInfo.zoningType}</div>
                        <div>Area: {hoveredParcelInfo.area?.toLocaleString(undefined, { maximumFractionDigits: 2 })} m²</div>
                    </div>
                )}
            </MapContainer>
        </div>
    )
}

export default Map
