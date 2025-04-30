import React, { useState, useEffect } from 'react';
import Map from './components/Map';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { toTitleCase } from './utils/utils';
import { MoonIcon, SunIcon, ChevronDownIcon, MapIcon } from '@heroicons/react/solid'


function App() {
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [selectedParcelInfo, setSelectedParcelInfo] = useState(null);
  const [zoningType, setZoningType] = useState('');
  const [parcels, setParcels] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetches all parcels to display on map
  const fetchParcels = async () => {
    setLoading(true);
    setParcels([]);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/parcels`);
      setParcels(response.data);
    } catch (error) {
      console.error('Error fetching parcels:', error);
      toast.error("Failed to load parcels. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetches parcels on start
  useEffect(() => {
    fetchParcels();
  }, []);

  // Submit zoning type update request
  const handleSubmit = async () => {
    if (!zoningType || selectedParcels.length === 0) {
      alert("Please select parcels and zoning type!");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/zoning-update`, {
        parcelIds: selectedParcels,
        zoningType: zoningType
      });
      await fetchParcels();
      setSelectedParcels([]);
      setSelectedParcelInfo(null);
      setZoningType('');
      toast.success("Zoning updated successfully!");
    } catch (error) {
      console.error('Error updating zoning:', error);
      toast.error("Failed to update zoning.");
    }
  };

  // Clear all selected parcels
  const handleClear = () => {
    setSelectedParcels([]);
    setSelectedParcelInfo(null);
    setZoningType('');
    toast.info("Cleared all selections")
  };

  // Calculate all zoning types selected currently
  const totalZoningTypesSelected = () => {
    const total = {};
  
    selectedParcels.forEach(id => {
      const parcel = parcels.find(p => p.id === id);
      if (parcel) {
        const type = parcel.zoningType || 'Unknown';
        total[type] = (total[type] || 0) + 1;
      }
    });
  
    return total;
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 relative">
        <div className="flex justify-center items-center space-x-3 flex-grow">
          <MapIcon className="h-8 w-8 animate-bounce text-blue-500" />
          <h1 className="font-bold text-3xl text-center">
            Zoning Update App
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-8 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transform transition-transform duration-200 hover:scale-125"
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

          {/* Loading Screen */}
          {loading && (
            <div className="z-[9999] absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center animate-fade-in">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-white text-xl font-semibold animate-pulse">Loading parcels...</p>
            </div>
          )}
        </div>

        {/* Information and Update */}
        <div className={`flex-1 w-1/4 px-6 py-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}>
          <h2 className="text-2xl font-bold mb-4">Parcel Information</h2>

          {selectedParcelInfo ? (
            <div className="space-y-2">
              <p><span className="font-semibold">Latitude:</span> {selectedParcelInfo.latitude}</p>
              <p><span className="font-semibold">Longitude:</span> {selectedParcelInfo.longitude}</p>
              <p><span className="font-semibold">Address:</span> {toTitleCase(selectedParcelInfo.address)}</p>
              <p><span className="font-semibold">Use Description:</span> {toTitleCase(selectedParcelInfo.usedesc)}</p>
              <p><span className="font-semibold">Zoning Type: </span>{selectedParcelInfo.zoningType}</p>
              <p><span className="font-semibold">Area:</span> {selectedParcelInfo.area.toLocaleString(undefined, { maximumFractionDigits: 2 })} m²</p>
              
              <div className={`p-4 rounded shadow mb-4 ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold">New Zoning Type:</label>
                  <div className="relative transition duration-300 ease-in-out transform hover:scale-105 ">
                    <select
                      value={zoningType}
                      onChange={(e) => setZoningType(e.target.value)}
                      className={`w-full p-2 rounded-md border appearance-none hover:cursor-pointer 
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
                    <div className="pt-2">
                      <p className="font-semibold">Zoning Types of Selected:</p>
                      {Object.entries(totalZoningTypesSelected()).map(([type, count]) => (
                        <p key={type} className="text-sm ml-2">
                            {type}: {count}
                        </p>
                      ))}
                    </div>
                    
                  </>
                )}
              </div>
              <div className="flex flex-col mt-4">
                <button
                  onClick={handleSubmit}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Update Zoning Type
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 mt-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition duration-300 ease-in-out transform hover:scale-105"
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
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
    
  );
}

export default App;
