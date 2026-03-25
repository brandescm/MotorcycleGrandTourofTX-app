import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Download, Map, Camera, CheckCircle, ChevronDown, Route, AlertCircle, Copy, Globe, X } from 'lucide-react';
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

  const [showMap, setShowMap] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState<number>(0);
  const mapRef = useRef<any>(null);
  const [hideVisited, setHideVisited] = useState(false);

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

  const startCoords = userLocation || cityCoordinates[startCity as keyof typeof cityCoordinates];

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const toggleVisited = (stopName: string) => {
    const newVisited = new Set(visitedStops);
    if (newVisited.has(stopName)) {
      newVisited.delete(stopName);
    } else {
      newVisited.add(stopName);
    }
    setVisitedStops(newVisited);
    localStorage.setItem('visitedStops', JSON.stringify(Array.from(newVisited)));
  };

  const [visitedStops, setVisitedStops] = useState<Set<string>>(() => {
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

  const getAddressFromCoords = async (lat: number, lon: number): Promise<string> => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    return data.display_name;
  };

  const openSingleStop = async (stop: TourStop) => {
    let url = 'https://www.google.com/maps/dir/?api=1';
    try {
      if (userLocation) {
        const originAddress = await getAddressFromCoords(userLocation.lat, userLocation.lon);
        url += `&origin=${encodeURIComponent(originAddress)}`;
      } else {
        url += `&origin=${encodeURIComponent(startCity + ', Texas')}`;
      }
    } catch (err) {
      console.error('Failed to get origin address:', err);
    }
    url += `&destination=${encodeURIComponent(`${stop.address}, ${stop.city}`)}`;
    window.open(url, '_blank');
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

  const openMultiStopRoute = async () => {
    const selectedStops = filteredStops.filter(s => selectedForRoute.has(s.name));

    if (selectedStops.length === 0) {
      alert('Please select at least one stop for your route');
      return;
    }

    const maxStops = userLocation ? 10 : 11;
    if (selectedStops.length > maxStops) {
      alert(`Google Maps supports a maximum of ${maxStops} stops${userLocation ? ' (including your current location)' : ''}. Please select fewer stops.`);
      return;
    }

    let url = 'https://www.google.com/maps/dir/?api=1';

    // Resolve origin
    if (userLocation) {
      const originAddress = await getAddressFromCoords(userLocation.lat, userLocation.lon);
      url += `&origin=${encodeURIComponent(originAddress)}`;
    } else {
      url += `&origin=${encodeURIComponent(startCity + ', Texas')}`;
    }

    // Resolve destination and waypoints
    const destination = selectedStops[selectedStops.length - 1];
    const waypoints = selectedStops.slice(0, -1)
      .map(s => encodeURIComponent(`${s.address}, ${s.city}`))
      .join('|');

    url += `&destination=${encodeURIComponent(`${destination.address}, ${destination.city}`)}`;
    if (waypoints) url += `&waypoints=${waypoints}`;

    window.open(url, '_blank');
  };
  const clearRoute = () => setSelectedForRoute(new Set());

  const stops: TourStop[] = baseStops.map(stop => {
    const dist = calculateDistance(startCoords.lat, startCoords.lon, stop.lat, stop.lon);
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

  const maxStopDistance = Math.max(...stops.map(s => s.distance));
  useEffect(() => {
    setDistanceFilter(maxStopDistance);
  }, [maxStopDistance]);

  const getDistanceColor = (distance: number) => {
    if (distance <= 50) return 'bg-green-800 text-green-200';
    if (distance <= 150) return 'bg-blue-800 text-blue-200';
    if (distance <= 250) return 'bg-yellow-800 text-yellow-200';
    if (distance <= 400) return 'bg-orange-800 text-orange-200';
    return 'bg-red-800 text-red-200';
  };

  const regions = ['all', 'Close', 'Hill Country', 'North', 'Central East', 'Northeast', 'North Central', 'East', 'South', 'West', 'Panhandle', 'Far West'];

  const filteredStops = stops
    .filter(stop => {
      const matchesSearch = stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            stop.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = selectedRegion === 'all' || stop.region === selectedRegion;
      const matchesDistance = stop.distance <= distanceFilter;
      const matchesVisited = !hideVisited || !visitedStops.has(stop.name);
      return matchesSearch && matchesRegion && matchesDistance && matchesVisited;
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
        `"${s.name}"`, `"${s.city}"`, `"${s.address}"`, s.distance, `"${s.region}"`
      ].join(','))
    ].join('\n');

    setShowExport(true);
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Address list copied to clipboard!');
      }).catch(() => {
        console.log('Clipboard copy failed, showing text instead');
      });
    }
  };

  const getCSVText = () => [
    ['Stop Name', 'City', 'Address', 'Distance (mi)', 'Region'].join(','),
    ...filteredStops.map(s => [
      `"${s.name}"`, `"${s.city}"`, `"${s.address}"`, s.distance, `"${s.region}"`
    ].join(','))
  ].join('\n');

  const getAddressListText = () =>
    filteredStops.map((s, i) =>
      `${i + 1}. ${s.name} - ${s.city}\n   ${s.address}\n   (${s.distance} miles)`
    ).join('\n\n');

  useEffect(() => {
    if (!showMap) return;

    const initMap = () => {
      if (typeof window === 'undefined' || !(window as any).L) {
        setTimeout(initMap, 100);
        return;
      }

      const L = (window as any).L;
      const centerLat = userLocation?.lat || cityCoordinates[startCity as keyof typeof cityCoordinates].lat;
      const centerLon = userLocation?.lon || cityCoordinates[startCity as keyof typeof cityCoordinates].lon;

      let zoom = 6;
      if (filteredStops.length === 0) {
        zoom = 8;
      } else {
        const maxDist = Math.max(...filteredStops.map(s => s.distance));
        if (maxDist <= 50) zoom = 9;
        else if (maxDist <= 100) zoom = 8;
        else if (maxDist <= 200) zoom = 7;
        else if (maxDist <= 300) zoom = 6;
        else zoom = 6;
      }

      if (mapRef.current) mapRef.current.remove();

      const map = L.map('osm-map').setView([centerLat, centerLon], zoom);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const blueIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background-color:#3b82f6;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      if (userLocation) {
        L.marker([userLocation.lat, userLocation.lon], { icon: blueIcon })
          .addTo(map)
          .bindPopup('<strong>Your Location</strong>');
      } else {
        const cityCoords = cityCoordinates[startCity as keyof typeof cityCoordinates];
        L.marker([cityCoords.lat, cityCoords.lon], { icon: blueIcon })
          .addTo(map)
          .bindPopup(`<strong>${startCity}</strong><br><em>Starting city</em>`);
      }

      filteredStops.forEach(stop => {
        const color = visitedStops.has(stop.name) ? '#22c55e' : '#f97316';
        const markerIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });
        L.marker([stop.lat, stop.lon], { icon: markerIcon })
          .addTo(map)
          .bindPopup(`<strong>${stop.name}</strong><br>${stop.city}<br>${stop.distance} miles`);
      });
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showMap, filteredStops, userLocation, startCity, visitedStops, distanceFilter]);

  const clearProgress = () => {
    if (confirm('Clear all visited stops?')) {
      setVisitedStops(new Set());
      localStorage.removeItem('visitedStops');
    }
  };

  return (
    <div className="app-container bg-gray-900 text-white">
      <div className="app-inner">

        {/* ── Header ── */}
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
              <span>Starting from: <strong className="text-orange-400">
                {userLocation ? 'Current Location' : startCity}
              </strong></span>
            </div>
          </div>
        </div>

        {/* ── Progress ── */}
        <div className="section-card">
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
            onClick={clearProgress}
            className="mt-3 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          >
            <X size={16} />
            <span className="hidden sm:inline">Clear Progress</span>
          </button>
        </div>

        {/* ── Starting Location ── */}
        <div className="section-card">
          <h3 className="text-lg font-bold text-orange-400 mb-4">Set Your Starting Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {!userLocation && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Choose a City</label>
                <select
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                  disabled={userLocation !== null}
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded border border-gray-700 focus:border-orange-500 outline-none"
                >
                  {Object.keys(cityCoordinates).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {userLocation && (
                  <p className="text-sm text-yellow-400 mt-1">City selection disabled while using current location</p>
                )}
              </div>
            )}
            <div className="flex items-end gap-2">
              {!userLocation ? (
                <button
                  onClick={getUserLocation}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
                >
                  <Navigation size={18} />
                  <span className="hidden sm:inline">Use My Location</span>
                </button>
              ) : (
                <button
                  onClick={() => { setUserLocation(null); setLocationError(null); }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors whitespace-nowrap"
                >
                  <Navigation size={18} className="rotate-180" />
                  <span className="hidden sm:inline">Clear Location</span>
                </button>
              )}
              {userLocation && (
                <div className="text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle size={16} />
                  <span className="hidden sm:inline">Location set</span>
                </div>
              )}
              {locationError && (
                <div className="text-red-400 text-sm">{locationError}</div>
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

        {/* ── Filters ── */}
        <div className="section-card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <h3 className="text-lg font-bold text-orange-400">Stop Filters</h3>
            </div>
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
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <label className="block text-sm text-gray-400 mb-2">
                Max Distance: {distanceFilter >= maxStopDistance ? 'All stops' : `≤ ${distanceFilter} mi`}
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">0</span>
                <input
                  type="range"
                  min={0}
                  max={maxStopDistance}
                  step={25}
                  value={distanceFilter}
                  onChange={(e) => setDistanceFilter(Number(e.target.value))}
                  className="flex-grow accent-orange-500"
                />
                <span className="text-xs text-gray-500">{maxStopDistance} mi</span>
                {distanceFilter < maxStopDistance && (
                  <button
                    onClick={() => setDistanceFilter(maxStopDistance)}
                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors whitespace-nowrap"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

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
          </div>
        </div>

        {/* ── CSV Export ── */}
        {showExport && (
          <div className="section-card">
            <h3 className="text-lg font-bold text-green-400 mb-3">CSV Data (Select All & Copy)</h3>
            <textarea
              readOnly
              value={getCSVText()}
              className="w-full h-64 bg-gray-900 text-white p-3 rounded border border-gray-700 font-mono text-xs"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
            <p className="text-gray-400 text-sm mt-2">
              Select all the text above, copy it, and paste into a text file. Save as .csv to open in Excel.
            </p>
            <button onClick={() => setShowExport(false)} className="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        )}

        {/* ── Copy List ── */}
        {showCopyText && (
          <div className="section-card">
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
            <button onClick={() => setShowCopyText(false)} className="mt-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        )}

        {/* ── Route Planner ── */}
        {showRoutePlanner && (
          <div className="section-card bg-gradient-to-r from-orange-900 to-orange-800 border border-orange-600">
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
                <span className="text-white font-bold text-lg">{selectedForRoute.size} selected</span>
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
                  selectedForRoute.size === 0 ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
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

        {/* ── Map ── */}
        <div className="section-card">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-orange-400">Stops Overview</h3>
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center gap-2 ${showMap ? 'bg-purple-700' : 'bg-purple-600'} hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors`}
            >
              <Globe size={18} />
              <span className="hidden sm:inline">{showMap ? 'Hide' : 'Show'} Map</span>
            </button>
          </div>

          {showMap && (
            <div className="mt-4">
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex items-center justify-between">
                  <p className="text-gray-400 text-sm">Showing {filteredStops.length} stops on map</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-400">Visited</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-xs text-gray-400">Not visited</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-400">{userLocation ? 'Your location' : 'Start city'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div id="osm-map" className="w-full h-[500px] rounded-lg border border-gray-700"></div>
            </div>
          )}
        </div>

        {/* ── Stops Table ── */}
        <div className="section-card" style={{ padding: 0 }}>
          {/* Table header bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <span className="text-sm text-gray-400">{filteredStops.length} stops shown</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideVisited(!hideVisited)}
                className={`flex items-center gap-2 ${
                  hideVisited ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-600 hover:bg-gray-500'
                } text-white px-3 py-2 rounded transition-colors`}
                title={hideVisited ? 'Showing unvisited only' : 'Showing all stops'}
              >
                <CheckCircle size={18} fill={hideVisited ? '#f97316' : 'none'} />
                <span className="hidden sm:inline">{hideVisited ? 'Unvisited Only' : 'Show All'}</span>
              </button>
              {visitedStops.size > 0 && (
                <button
                  onClick={clearProgress}
                  style={{ backgroundColor: '#dc2626' }}
                  className="flex items-center gap-2 text-white px-3 py-2 rounded transition-colors hover:opacity-90"
                  title="Clear Progress"
                >
                  <X size={18} />
                  <span className="hidden sm:inline">Clear Progress</span>
                </button>
              )}
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead className="bg-gray-950">
                <tr>
                  <th className="px-4 py-3 text-left text-orange-500">#</th>
                  {showRoutePlanner && (
                    <th className="px-4 py-3 text-left text-orange-500">Route</th>
                  )}
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
                    {/* Mobile card */}
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
                          <CheckCircle size={20} fill={visitedStops.has(stop.name) ? 'currentColor' : '#f97316'} />
                        </button>
                        <span className={`flex-grow font-semibold ${visitedStops.has(stop.name) ? 'line-through opacity-60' : ''}`}>
                          {stop.name}
                        </span>
                        <div className="flex gap-2 items-center flex-shrink-0 ml-auto">
                          <button
                            onClick={(e) => { e.stopPropagation(); openSingleStop(stop); }}
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

                    {/* Desktop cells */}
                    <td className="desktop-cell px-4 py-3 text-gray-400">{idx + 1}</td>
                    {showRoutePlanner && (
                      <td className="desktop-cell px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedForRoute.has(stop.name)}
                          onChange={() => addToRoute(stop.name)}
                          className="w-5 h-5 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 cursor-pointer"
                        />
                      </td>
                    )}
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
                            onClick={() => openSingleStop(stop)}
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

        {/* ── Special Stops ── */}
        <div className="section-card">
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

export default App;
