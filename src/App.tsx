
import { useState } from 'react';
import { MapPin, Navigation, Search, Download, Map, Camera, CheckCircle, ChevronDown, Route, AlertCircle, Copy } from 'lucide-react';
import './App.css'
import './mobile.css'
import { baseStops, type TourStop } from './tourStops';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [startCity, setStartCity] = useState('Liberty Hill');
  
  const [selectedForRoute, setSelectedForRoute] = useState<Set<string>>(new Set());
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  

  // Approximate coordinates for distance calculations
  const cityCoordinates = {
    'Liberty Hill': { lat: 30.6660, lon: -97.9225 },
    'Austin': { lat: 30.2672, lon: -97.7431 },
    'Georgetown': { lat: 30.6327, lon: -97.6769 },
    'San Antonio': { lat: 29.4241, lon: -98.4936 },
    'Houston': { lat: 29.7604, lon: -95.3698 },
    'Dallas': { lat: 32.7767, lon: -96.7970 },
    'Fort Worth': { lat: 32.7555, lon: -97.3308 },
    'El Paso': { lat: 31.7619, lon: -106.4850 },
    'Amarillo': { lat: 35.2220, lon: -101.8313 },
    'Lubbock': { lat: 33.5779, lon: -101.8552 },
    'Corpus Christi': { lat: 27.8006, lon: -97.3964 },
    'Abilene': { lat: 32.4487, lon: -99.7331 },
    'Waco': { lat: 31.5493, lon: -97.1467 },
    'Midland': { lat: 31.9973, lon: -102.0779 },
    'Tyler': { lat: 32.3513, lon: -95.3011 }
  };

  // Calculate distances based on selected starting city
  const startCoords = cityCoordinates[startCity as keyof typeof cityCoordinates];
  console.log('Start City:', userLocation ? 'Current Location' : startCity);
  console.log('Start Coords:', startCoords);
  // console.log('First stop:', baseStops[0]);

  // Get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLocationError(null);
      },
      (error) => {
        setLocationError('Unable to get your location');
        console.error('Geolocation error:', error);
      }
    );
  };

  const calculateDistance = (lat1:number, lon1:number, lat2:number, lon2:number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance);
  };

  const toggleVisited = (stopName: string) => {
    const newVisited = new Set(visitedStops);
    if (newVisited.has(stopName)) {
      newVisited.delete(stopName);
    } else {
      newVisited.add(stopName);
    }
    setVisitedStops(newVisited);
    // Save to localStorage
    localStorage.setItem('visitedStops', JSON.stringify(Array.from(newVisited)));
  };

  const [visitedStops, setVisitedStops] = useState<Set<string>>(() => {
    // Load from localStorage on initial render
    const saved = localStorage.getItem('visitedStops');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [expandedStops, setExpandedStops] = useState<Set<number>>(new Set());

  const toggleExpanded = (idx: number) => {
      const newExpanded = new Set(expandedStops);
      if (newExpanded.has(idx)) {
        newExpanded.delete(idx);
      } else {
        newExpanded.add(idx);
      }
      setExpandedStops(newExpanded);
  };

  const addToRoute = (stopName: string) => {
    const newSelected = new Set(selectedForRoute);
    if (newSelected.has(stopName)) {
      newSelected.delete(stopName);
    } else {
      newSelected.add(stopName);
    }
    setSelectedForRoute(newSelected);
  };

  const openMultiStopRoute = () => {
    const selectedStops = filteredStops.filter(s => selectedForRoute.has(s.name));
    
    if (selectedStops.length === 0) {
      alert('Please select at least one stop for your route');
      return;
    }
    
    if (selectedStops.length === 1) {
      // Single stop - just open it
      const stop = selectedStops[0];
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address + ', ' + stop.city)}`, '_blank');
      return;
    }
    
    const maxStops = userLocation ? 10 : 11;
    // Google Maps allows max 10 waypoints, so limit to 11 total stops
    if (selectedStops.length > maxStops) {
      alert(`Google Maps supports a maximum of ${maxStops} stops${userLocation ? ' (including your current location)' : ''}. Please select fewer stops.`);
      return;
    }
    
    let url = 'https://www.google.com/maps/dir/?api=1';
  
    // Use current location as origin if available
    if (userLocation) {
      url += `&origin=${userLocation.lat},${userLocation.lon}`;
      
      // All selected stops become waypoints except the last one (destination)
      if (selectedStops.length === 1) {
        url += `&destination=${encodeURIComponent(selectedStops[0].address + ', ' + selectedStops[0].city)}`;
      } else {
        const destination = selectedStops[selectedStops.length - 1];
        const waypoints = selectedStops.slice(0, -1)
          .map(s => encodeURIComponent(`${s.address}, ${s.city}`))
          .join('|');
        
        url += `&destination=${encodeURIComponent(destination.address + ', ' + destination.city)}`;
        if (waypoints) {
          url += `&waypoints=${waypoints}`;
        }
      }
    } else {
      // No user location - use first stop as origin
      if (selectedStops.length === 1) {
        const stop = selectedStops[0];
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address + ', ' + stop.city)}`, '_blank');
        return;
      }
      
      const origin = selectedStops[0];
      const destination = selectedStops[selectedStops.length - 1];
      const waypoints = selectedStops.slice(1, -1)
        .map(s => encodeURIComponent(`${s.address}, ${s.city}`))
        .join('|');
      
      url += `&origin=${encodeURIComponent(origin.address + ', ' + origin.city)}`;
      url += `&destination=${encodeURIComponent(destination.address + ', ' + destination.city)}`;
      
      if (waypoints) {
        url += `&waypoints=${waypoints}`;
      }
    }
    
    window.open(url, '_blank');
  };

  const clearRoute = () => {
    setSelectedForRoute(new Set());
  };

  const stops: TourStop[] = baseStops.map(stop => {
    const dist = calculateDistance(startCoords.lat, startCoords.lon, stop.lat, stop.lon);
    console.log(`Distance from ${userLocation ? 'current location' : startCity} to ${stop.city}: ${dist}`);
    return {
      name: stop.name,
      city: stop.city,
      address: stop.address,
      region: stop.region,
      distance: isNaN(dist) ? stop.distance : dist,
      lat: stop.lat,
      lon: stop.lon,
      imageUrl: stop.imageUrl
    };
  });

  const getDistanceColor = (distance: number) => {
    if (distance <= 50) {
      return 'bg-green-800 text-green-200';
    } else if (distance <= 150) {
      return 'bg-blue-800 text-blue-200';
    } else if (distance <= 250) {
      return 'bg-yellow-800 text-yellow-200';
    } else if (distance <= 400) {
      return 'bg-orange-800 text-orange-200';
    } else {
      return 'bg-red-800 text-red-200';
    }
  };

  const regions = ['all', 'Close', 'Hill Country', 'North', 'Central East', 'Northeast', 'North Central', 'East', 'South', 'West', 'Panhandle', 'Far West'];

  const filteredStops = stops
    .filter(stop => {
      const matchesSearch = stop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           stop.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || stop.region === selectedRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'city') return a.city.localeCompare(b.city);
      return 0;
    });

  const [showExport, setShowExport] = useState(false);
  const [showCopyText, setShowCopyText] = useState(false);

  const exportToCSV = () => {
    const csv = [
      ['Stop Name', 'City', 'Address', 'Distance (mi)', 'Region'].join(','),
      ...filteredStops.map(s => [
        `"${s.name}"`,
        `"${s.city}"`,
        `"${s.address}"`,
        s.distance,
        `"${s.region}"`
      ].join(','))
    ].join('\n');
    
    setShowExport(true);
    
    // Try to download
    try {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'texas_motorcycle_tour_stops.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.log('Download failed, showing text instead');
    }
  };

  const copyAddressList = () => {
    const text = filteredStops.map((s, i) => 
      `${i + 1}. ${s.name} - ${s.city}\n   ${s.address}\n   (${s.distance} miles)`
    ).join('\n\n');
    
    setShowCopyText(true);
    
    // Try to copy
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Address list copied to clipboard!');
      }).catch(() => {
        console.log('Clipboard copy failed, showing text instead');
      });
    }
  };

  const getCSVText = () => {
    return [
      ['Stop Name', 'City', 'Address', 'Distance (mi)', 'Region'].join(','),
      ...filteredStops.map(s => [
        `"${s.name}"`,
        `"${s.city}"`,
        `"${s.address}"`,
        s.distance,
        `"${s.region}"`
      ].join(','))
    ].join('\n');
  };

  const getAddressListText = () => {
    return filteredStops.map((s, i) => 
      `${i + 1}. ${s.name} - ${s.city}\n   ${s.address}\n   (${s.distance} miles)`
    ).join('\n\n');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500 mb-2">
            2026 Texas Motorcycle Tour Stops
          </h1>
          <p className="text-xs text-gray-500">App Version: {APP_VERSION}</p>
          <p className="text-gray-400">Organized by Distance from Your Starting Point</p>
          <div className="flex justify-center gap-6 mt-4 text-sm flex-wrap">
            <a 
              href="https://motorcyclegrandtouroftexas.com/picture-submission-portal-2026-tour/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors font-medium"
            >
              <Camera size={16} />
              Submit Tour Photos
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="text-orange-400" size={16} />
              <span>{stops.length} Total Stops</span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="text-green-400" size={16} />
              <span>Starting from: <strong className="text-orange-400">{startCity}</strong></span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-orange-400">Your Progress</h3>
            <span className="text-2xl font-bold text-green-400">
              {visitedStops.size} / {stops.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-500"
              style={{ width: `${(visitedStops.size / stops.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {stops.length - visitedStops.size} stops remaining
            {visitedStops.size >= 25 && visitedStops.size < 50 && " • You'll earn a Tour Finisher patch!"}
            {visitedStops.size >= 50 && " • 🎉 Tour Complete! You earned the 50 Stop Finisher rocker!"}
          </p>
          <button
            onClick={() => {
              if (confirm('Clear all visited stops?')) {
                setVisitedStops(new Set());
                localStorage.removeItem('visitedStops');
              }
            }}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            Clear Progress
          </button>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-orange-400 mb-4">Set Your Starting Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Choose a City</label>
              <select
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:border-orange-500 outline-none"
              >
                {Object.keys(cityCoordinates).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={getUserLocation}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
                title="Use my current location"
              >
                <Navigation size={18} />
                <span className="hidden sm:inline">Use My Location</span>
              </button>
              {userLocation && (
                <div className="text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle size={16} />
                  <span className="hidden sm:inline">Location set</span>
                </div>
              )}
              {locationError && (
                <div className="text-red-400 text-sm">
                  {locationError}
                </div>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {userLocation 
              ? 'Using your current location for distance calculations and route planning.'
              : 'Distances are calculated as straight-line ("as the crow flies") and will be slightly less than actual riding distances.'
            }
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm text-gray-400 mb-2">Search Stops</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 text-white pl-10 pr-4 py-2 rounded border border-gray-700 focus:border-orange-500 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Filter by Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:border-orange-500 outline-none"
              >
                {regions.map(r => (
                  <option key={r} value={r}>{r === 'all' ? 'All Regions' : r}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:border-orange-500 outline-none"
              >
                <option value="distance">Distance</option>
                <option value="name">Name</option>
                <option value="city">City</option>
              </select>
            </div>
          </div>

          {/* Icon buttons row */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
              title="Export to CSV"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={copyAddressList}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors"
              title="Copy Address List"
            >
              <Copy size={18} />
              <span className="hidden sm:inline">Copy List</span>
            </button>
            <button
              onClick={() => setShowRoutePlanner(!showRoutePlanner)}
              className={`flex items-center justify-center gap-2 ${showRoutePlanner ? 'bg-orange-700' : 'bg-orange-600'} hover:bg-orange-700 text-white px-3 py-2 rounded transition-colors`}
              title={showRoutePlanner ? 'Hide Route Planner' : 'Show Route Planner'}
            >
              <Route size={18} />
              <span className="hidden sm:inline">{showRoutePlanner ? 'Hide' : 'Plan'} Route</span>
            </button>
            {visitedStops.size > 0 && (
              <button
                onClick={() => {
                  if (confirm('Clear all visited stops?')) {
                    setVisitedStops(new Set());
                    localStorage.removeItem('visitedStops');
                  }
                }}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors ml-auto"
                title="Clear Progress"
              >
                <CheckCircle size={18} />
                <span className="hidden sm:inline">Clear Progress</span>
              </button>
            )}
          </div>
        </div>

        {showExport && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-green-400 mb-3">CSV Data (Select All & Copy)</h3>
            <textarea
              readOnly
              value={getCSVText()}
              className="w-full h-64 bg-gray-900 text-white p-3 rounded border border-gray-700 font-mono text-xs"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <p className="text-gray-400 text-sm mt-2">
              Select all the text above, copy it, and paste into a text file. Save as .csv to open in Excel or import to route planners.
            </p>
            <button
              onClick={() => setShowExport(false)}
              className="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        )}

        {showCopyText && (
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-400 mb-3">Address List (Select All & Copy)</h3>
            <textarea
              readOnly
              value={getAddressListText()}
              className="w-full h-96 bg-gray-900 text-white p-3 rounded border border-gray-700 text-sm"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <p className="text-gray-400 text-sm mt-2">
              Select all the text above and copy it. You can paste this into route planning apps.
            </p>
            <button
              onClick={() => setShowCopyText(false)}
              className="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        )}
        {showRoutePlanner && (
        <div className="bg-gradient-to-r from-orange-900 to-orange-800 rounded-lg p-6 mb-6 border border-orange-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Route Planner</h3>
              <p className="text-orange-200 text-sm mt-1">
                {userLocation 
                  ? `Route will start from your current location (max ${selectedForRoute.size}/10 stops)`
                  : `Route will start from first selected stop (max ${selectedForRoute.size}/11 stops)`
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-lg">
                {selectedForRoute.size} selected
              </span>
              {selectedForRoute.size > 0 && (
                <button
                  onClick={clearRoute}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {selectedForRoute.size > 0 && (
            <div className="bg-orange-950 bg-opacity-50 rounded-lg p-4 mb-4">
              <h4 className="text-orange-300 font-semibold mb-2 text-sm">Selected Route:</h4>
              <ol className="space-y-1">
                {filteredStops
                  .filter(s => selectedForRoute.has(s.name))
                  .map((stop, idx) => (
                    <li key={stop.name} className="text-white text-sm flex items-center gap-2">
                      <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{stop.name} ({stop.city})</span>
                      <button
                        onClick={() => addToRoute(stop.name)}
                        className="text-red-400 hover:text-red-300 ml-auto text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
              </ol>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={openMultiStopRoute}
              disabled={selectedForRoute.size === 0}
              className={`flex items-center justify-center gap-2 ${
                selectedForRoute.size === 0 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-6 py-3 rounded-lg transition-colors font-semibold`}
            >
              <Route size={20} />
              Open Route in Google Maps
            </button>
            {selectedForRoute.size > 11 && (
              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                <AlertCircle size={16} />
                Too many stops! Max 11 allowed
              </div>
            )}
          </div>
        </div>
      )}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-950">
                <tr>
                  <th className="px-4 py-3 text-left text-orange-500">#</th>
                  <th className="px-4 py-3 text-left text-orange-500">Route</th>
                  <th className="px-4 py-3 text-left text-orange-500">Stop Name</th>
                  <th className="px-4 py-3 text-left text-orange-500">City</th>
                  <th className="px-4 py-3 text-left text-orange-500">Address</th>
                  <th className="px-4 py-3 text-left text-orange-500">Distance</th>
                  <th className="px-4 py-3 text-left text-orange-500">Region</th>
                </tr>
              </thead>
              <tbody>
                {filteredStops.map((stop, idx) => (
                  <tr 
                    key={idx} 
                    className={`border-b border-gray-700 transition-colors ${visitedStops.has(stop.name) ? 'bg-green-900 bg-opacity-20' : ''}`}
                  >
                    {/* Mobile: Collapsed view */}
                    <td className="mobile-card" colSpan={6}>
                      <div className="mobile-card-header">
                        {showRoutePlanner && (
                          <input
                            type="checkbox"
                            checked={selectedForRoute.has(stop.name)}
                            onChange={() => addToRoute(stop.name)}
                            className="w-6 h-6 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 cursor-pointer flex-shrink-0"
                          />
                        )}
                        <button
                          onClick={() => toggleVisited(stop.name)}
                          className={`transition-colors flex-shrink-0 ${visitedStops.has(stop.name) ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'}`}
                          title={visitedStops.has(stop.name) ? 'Mark as not visited' : 'Mark as visited'}
                        >
                          <CheckCircle size={20} fill={visitedStops.has(stop.name) ? 'currentColor' : 'none'} />
                        </button>
                        
                        <span className={`flex-grow font-semibold ${visitedStops.has(stop.name) ? 'line-through opacity-60' : ''}`}>
                          {stop.name}
                        </span>
                        
                        <div className="flex gap-2 items-center flex-shrink-0">
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address + ', ' + stop.city)}`, '_blank')}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View on Google Maps"
                          >
                            <Map size={18} />
                          </button>
                          {stop.imageUrl && (
                            <button
                              onClick={() => window.open(stop.imageUrl, '_blank')}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                              title="View Stop Photo"
                            >
                              <Camera size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => toggleExpanded(idx)}
                            className="text-gray-400 hover:text-gray-200 transition-all lg:hidden"
                            title={expandedStops.has(idx) ? 'Collapse' : 'Expand'}
                          >
                            <ChevronDown 
                              size={20} 
                              className={`transition-transform ${expandedStops.has(idx) ? 'rotate-180' : ''}`}
                            />
                          </button>
                        </div>
                      </div>
                      
                      {/* Mobile: Expanded details */}
                      <div className={`mobile-card-details ${expandedStops.has(idx) ? 'expanded' : ''}`}>
                        <div className="detail-row">
                          <span className="detail-label">City:</span>
                          <span className="text-gray-300">{stop.city}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Address:</span>
                          <span className="text-gray-400 text-sm">{stop.address}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Distance:</span>
                          <span className={`inline-block ${getDistanceColor(stop.distance)} px-3 py-1 rounded-full text-sm font-semibold`}>
                            {stop.distance} mi
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Region:</span>
                          <span className="text-blue-400 text-sm">{stop.region}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Desktop: Regular table view */}
                    <td className="desktop-cell px-4 py-3 text-gray-400">{idx + 1}</td>
                    <td className="desktop-cell px-4 py-3">  {/* Add this new cell */}
                      {showRoutePlanner && (
                        <input
                          type="checkbox"
                          checked={selectedForRoute.has(stop.name)}
                          onChange={() => addToRoute(stop.name)}
                          className="w-5 h-5 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="desktop-cell px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVisited(stop.name)}
                          className={`transition-colors flex-shrink-0 ${visitedStops.has(stop.name) ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'}`}
                          title={visitedStops.has(stop.name) ? 'Mark as not visited' : 'Mark as visited'}
                        >
                          <CheckCircle size={20} fill={visitedStops.has(stop.name) ? 'currentColor' : 'none'} />
                        </button>
                        <span className={visitedStops.has(stop.name) ? 'line-through opacity-60' : ''}>
                          {stop.name}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address + ', ' + stop.city)}`, '_blank')}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="View on Google Maps"
                          >
                            <Map size={16} />
                          </button>
                          {stop.imageUrl && (
                            <button
                              onClick={() => window.open(stop.imageUrl, '_blank')}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                              title="View Stop Photo"
                            >
                              <Camera size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="desktop-cell px-4 py-3 text-gray-300">{stop.city}</td>
                    <td className="desktop-cell px-4 py-3 text-gray-400 text-sm">{stop.address}</td>
                    <td className="desktop-cell px-4 py-3">
                      <span className={`inline-block ${getDistanceColor(stop.distance)} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {stop.distance} mi
                      </span>
                    </td>
                    <td className="desktop-cell px-4 py-3">
                      <span className="text-blue-400 text-sm">{stop.region}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Distance Groups */}
        <div className="mt-6 bg-blue-900 rounded-lg p-6 border border-blue-700">
          <h2 className="text-xl font-bold mb-3 text-blue-300">Distance Groups from {startCity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-bold text-green-400 mb-2">Close (0-50 mi)</h3>
              <p className="text-gray-300">{stops.filter(s => s.distance <= 50).length} stops - Perfect for short day trips</p>
            </div>
            <div>
              <h3 className="font-bold text-blue-400 mb-2">Near (51-150 mi)</h3>
              <p className="text-gray-300">{stops.filter(s => s.distance > 50 && s.distance <= 150).length} stops - Good for day trips or overnights</p>
            </div>
            <div>
              <h3 className="font-bold text-yellow-400 mb-2">Medium (151-250 mi)</h3>
              <p className="text-gray-300">{stops.filter(s => s.distance > 150 && s.distance <= 250).length} stops - Weekend trips recommended</p>
            </div>
            <div>
              <h3 className="font-bold text-orange-400 mb-2">Far (251-400 mi)</h3>
              <p className="text-gray-300">{stops.filter(s => s.distance > 250 && s.distance <= 400).length} stops - 2-3 day trips</p>
            </div>
            <div>
              <h3 className="font-bold text-red-400 mb-2">Very Far (401+ mi)</h3>
              <p className="text-gray-300">{stops.filter(s => s.distance > 400).length} stops - Multi-day expeditions</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-3 text-orange-400">Special Stops</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• <strong>VFW Posts:</strong> Visit any VFW post - not listed here, add to any convenient trip</li>
            <li>• <strong>Lone Star Rider's Van:</strong> Traveling location - check online for current position</li>
            <li>• <strong>Alternate Stops (ALT):</strong> Can substitute for regular stops - 5 alternates included in list</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// export default TourRoutePlanner;
export default App
