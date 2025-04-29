import React, { useState, useEffect } from 'react';
import Map from './components/Map';

import axios from 'axios';

import { toTitleCase } from './utils/utils';
import { MoonIcon, SunIcon, ChevronDownIcon, MapIcon } from '@heroicons/react/solid'


function App() {
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [selectedParcelInfo, setSelectedParcelInfo] = useState(null);
  const [zoningType, setZoningType] = useState('');
  const [parcels, setParcels] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/parcels`);
        setParcels(response.data);
      } catch (error) {
        console.error('Error fetching parcels:', error);
      }
    };
    fetchParcels();
  }, []);

  const handleSubmit = async () => {
    if (!zoningType || selectedParcels.length === 0) {
      alert("Please select parcels and zoning type!");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/zoning-update`, {
        parcelIds: selectedParcels,
        newZoningType: zoningType
      });
      alert("Zoning updated successfully!");
      setSelectedParcels([]);
      setSelectedParcelInfo(null);
      setZoningType('');
    } catch (error) {
      console.error('Error updating zoning:', error);
      alert("Error updating zoning.");
    }
  };

  const handleClear = () => {
    setSelectedParcels([]);
    setSelectedParcelInfo(null);
    setZoningType('');
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center p-6 relative">
        <div className="flex justify-center items-center space-x-3 flex-grow">
          <MapIcon className="h-8 w-8 animate-bounce text-blue-500" />
          <h1 className="font-bold text-3xl text-center">
            Zoning Update App
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-6 right-8 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transform transition-transform duration-200 hover:scale-125"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>
      <div className="flex flex-1">
        {/* Map */}
        <div className="flex-2 w-3/4">
          <Map 
            selectedParcels={selectedParcels}
            setSelectedParcels={setSelectedParcels}
            selectedParcelInfo={selectedParcelInfo}
            setSelectedParcelInfo={setSelectedParcelInfo}
            parcels={parcels}
            darkMode={darkMode}
            setZoningType={setZoningType}
          />
        </div>

        {/* Information and Update */}
        <div className={`flex-1 w-1/4 p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
          <h2 className="text-2xl font-bold mb-4">Parcel Information</h2>

          {selectedParcelInfo ? (
            <div className="space-y-3">
              <p><span className="font-semibold">Latitude:</span> {selectedParcelInfo.latitude}</p>
              <p><span className="font-semibold">Longitude:</span> {selectedParcelInfo.longitude}</p>
              <p><span className="font-semibold">Address:</span> {toTitleCase(selectedParcelInfo.address)}</p>
              <p><span className="font-semibold">Use Description:</span> {toTitleCase(selectedParcelInfo.usedesc)}</p>
              <p><span className="font-semibold">Zoning Type: </span>{selectedParcelInfo.zoningType}</p>
              <p><span className="font-semibold">Area:</span> {selectedParcelInfo.area.toLocaleString(undefined, { maximumFractionDigits: 2 })} m²</p>
              
              <div className={`p-4 rounded shadow mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold">New Zoning Type:</label>
                  <div className="relative">
                    <select
                      value={zoningType}
                      onChange={(e) => setZoningType(e.target.value)}
                      className={`w-full p-2 rounded-md border appearance-none
                        ${darkMode 
                          ? 'bg-gray-700 text-white border-gray-500 focus:ring-2 focus:ring-blue-400' 
                          : 'bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500'
                        }
                        focus:outline-none
                        transition duration-200 ease-in-out
                      `}
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Planned">Planned</option>
                    </select>
                    <ChevronDownIcon 
                      className={`w-5 h-5 absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none 
                        ${darkMode ? 'text-white' : 'text-black'}`}
                    />
                  </div>
                  
                </div>
                {selectedParcels.length > 1 && (
                  <>
                    <p className="font-semibold pt-3">Selected Parcels: {selectedParcels.length}</p>
                    <p className="font-semibold pt  -3">
                      Total Area: {selectedParcels.reduce((sum, id) => {
                        const parcel = parcels.find(p => p.id === id);
                        return sum + (parcel?.area || 0);
                      }, 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} m²
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-4">
                <button
                  onClick={handleSubmit}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl"
                >
                  Update Zoning Type
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No parcel selected.</p>
          )}
        </div>
      </div>
    </div>
    
  );
}

export default App;
