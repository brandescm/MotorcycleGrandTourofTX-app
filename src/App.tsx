
import { useState } from 'react';
import { MapPin, Navigation, Search, Download, Map, Camera } from 'lucide-react';
import './App.css'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [startCity, setStartCity] = useState('Liberty Hill');
  

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

  const baseStops = [
  // Within 50 miles
  { name: "Gus's Drug Mural", city: "Georgetown", address: "702 e university ave, Georgetown, TX", lat: 30.6327, lon: -97.6769, distance: 25, region: "Central" },
  { name: "Old Taylor High School", city: "Taylor", address: "410 west 7th st, Taylor, TX", lat: 30.5705, lon: -97.4094, distance: 35, region: "Central" },
  { name: "Dead Man's Hole", city: "Marble Falls", address: "county rd 401, Marble Falls, TX", lat: 30.5783, lon: -98.2714, distance: 40, region: "Central" },
  { name: "Hill Country Motorheads Museum", city: "Burnet", address: "2001 w state hwy 29, Burnet, TX", lat: 30.7580, lon: -98.2283, distance: 40, region: "Central" },
  { name: "Highland Lake Squadron", city: "Burnet", address: "2402 s water st, Burnet, TX", lat: 30.7580, lon: -98.2283, distance: 40, region: "Central" },
  { name: "The Gas Station", city: "Bastrop", address: "1073 tx 304, Bastrop, TX", lat: 30.1102, lon: -97.3152, distance: 45, region: "Central" },
  { name: "LBJ Boyhood Home", city: "Johnson City", address: "200 e elm st, Johnson City, TX", lat: 30.2769, lon: -98.4072, distance: 48, region: "Central" },
  
  // 51-100 miles
  { name: "Driftwood Store", city: "Driftwood", address: "fm 150, Driftwood, TX", lat: 30.1069, lon: -98.0308, distance: 55, region: "Hill Country" },
  { name: "Fischer Store", city: "Fischer", address: "4040 fm 484, Fischer, TX", lat: 29.9697, lon: -98.2536, distance: 60, region: "Hill Country" },
  { name: "Flying L Ranch Resort", city: "Bandera", address: "675 flying l drive, Bandera, TX", lat: 29.7269, lon: -99.0736, distance: 70, region: "Hill Country" },
  { name: "Waring General Store (ALT)", city: "Waring", address: "544 waring welfare rd, Waring, TX", lat: 29.9406, lon: -98.7814, distance: 75, region: "Hill Country" },
  { name: "Castell General Store", city: "Castell", address: "19522 w ranch road 152, Castell, TX", lat: 30.6769, lon: -99.0914, distance: 80, region: "Hill Country" },
  { name: "The Shop", city: "Waxahachie", address: "315 w main st, suite 13, Waxahachie, TX", lat: 32.3868, lon: -96.8483, distance: 95, region: "North" },
  { name: "Frio Canyon Motorcycle Shop", city: "Leakey", address: "657 ranch road 337, Leakey, TX", lat: 29.7289, lon: -99.7608, distance: 100, region: "Hill Country" },
  
  // 101-150 miles
  { name: "Washington on the Brazos", city: "Washington", address: "23400 park road 12, Washington, TX", lat: 30.3319, lon: -96.1550, distance: 105, region: "Central East" },
  { name: "Blue Bell Creamery", city: "Brenham", address: "1101 south blue bell road, Brenham, TX", lat: 30.1669, lon: -96.3978, distance: 110, region: "Central East" },
  { name: "Classic Rock Cafe", city: "Navasota", address: "129 e Washington ave, Navasota, TX", lat: 30.3880, lon: -96.0878, distance: 110, region: "Central East" },
  { name: "Welcome General Store", city: "Welcome", address: "12528 fm109, Welcome, TX", lat: 30.0347, lon: -96.3478, distance: 115, region: "Central East" },
  { name: "Leona General Store", city: "Leona", address: "136 Leona blvd n, Leona, TX", lat: 31.1569, lon: -95.9653, distance: 120, region: "Central East" },
  { name: "Tex Miller's", city: "Cameron", address: "104 n fannin ave, Cameron, TX", lat: 30.8530, lon: -96.9708, distance: 125, region: "Central East" },
  { name: "Edge General Store", city: "Hearne", address: "7250 edge cut off road, Hearne, TX", lat: 30.8786, lon: -96.5928, distance: 130, region: "Central East" },
  { name: "Rosebud Historical Museum", city: "Rosebud", address: "117 n 2nd st, Rosebud, TX", lat: 31.0764, lon: -96.9786, distance: 135, region: "Central East" },
  { name: "Texas Sidecar Co", city: "Teague", address: "210 elm street, Teague, TX", lat: 31.6236, lon: -96.2831, distance: 140, region: "Central East" },
  { name: "Cindy Walker Mural", city: "Mexia", address: "McKinney st, Mexia, TX", lat: 31.6797, lon: -96.4822, distance: 140, region: "Central East" },
  { name: "Motorcycle Gear", city: "Plano", address: "2637 Summit ave, Plano, TX", lat: 33.0198, lon: -96.6989, distance: 145, region: "North" },
  { name: "Moto Liberty", city: "Addison", address: "15402 midway road, Addison, TX", lat: 32.9540, lon: -96.8353, distance: 145, region: "North" },
  { name: "Riders Bike Supply", city: "Lewisville", address: "101 e southwest pkwy, Lewisville, TX", lat: 33.0462, lon: -96.9942, distance: 145, region: "North" },
  { name: "Welcome to Celina Mural", city: "Celina", address: "732 e pecan st, Celina, TX", lat: 33.3245, lon: -96.7845, distance: 150, region: "North" },
  
  // 151-200 miles
  { name: "Battle Creek Burial Ground", city: "Dawson", address: "state hwy 31, Dawson, TX", lat: 31.8944, lon: -96.7100, distance: 155, region: "Northeast" },
  { name: "Calaboose", city: "Kemp", address: "106 w 11th st, Kemp, TX", lat: 32.4426, lon: -96.2286, distance: 160, region: "Northeast" },
  { name: "Leonard Pharmacy", city: "Leonard", address: "122 w collin st, Leonard, TX", lat: 33.3784, lon: -96.2464, distance: 165, region: "Northeast" },
  { name: "Van Zandt County Vet Memorial (ALT)", city: "Canton", address: "1200 s trade days blvd, Canton, TX", lat: 32.5568, lon: -95.8630, distance: 170, region: "Northeast" },
  { name: "Horny Toad Bar", city: "Cranfills Gap", address: "319 N 3rd st, Cranfills Gap, TX", lat: 31.7711, lon: -97.8233, distance: 175, region: "North Central" },
  { name: "Victoria County Courthouse", city: "Victoria", address: "101 n bridge st, Victoria, TX", lat: 28.8053, lon: -97.0036, distance: 180, region: "South" },
  { name: "Yorktown Memorial Hospital (ALT)", city: "Yorktown", address: "728 w main st, Yorktown, TX", lat: 28.9811, lon: -97.5028, distance: 185, region: "South" },
  
  // 201-250 miles
  { name: "Gladewater Museum", city: "Gladewater", address: "w. pacific and dean, Gladewater, TX", lat: 32.5368, lon: -94.9427, distance: 210, region: "East" },
  { name: "Herrman & Herrman", city: "Corpus Christi", address: "1201 3rd st, Corpus Christi, TX", lat: 27.8006, lon: -97.3964, distance: 220, region: "South" },
  { name: "Rusk KOA", city: "Rusk", address: "745 fm 343 east, Rusk, TX", lat: 31.7957, lon: -95.1508, distance: 230, region: "East" },
  { name: "Fort Belknap", city: "Newcastle", address: "114 fort cir, Newcastle, TX", lat: 33.1948, lon: -98.7414, distance: 240, region: "North Central" },
  
  // 251-300 miles
  { name: "Jefferson General Store", city: "Jefferson", address: "113 e Austin st, Jefferson, TX", lat: 32.7568, lon: -94.3452, distance: 270, region: "East" },
  { name: "Flying G Motorcycle Museum", city: "Joaquin", address: "10552 us 84, Joaquin, TX", lat: 31.9650, lon: -94.0497, distance: 280, region: "East" },
  { name: "Museum of Gulf Coast", city: "Port Arthur", address: "700 procter st, Port Arthur, TX", lat: 29.8988, lon: -93.9402, distance: 290, region: "East" },
  
  // 301-400 miles
  { name: "Bush Family Home", city: "Midland", address: "1412 w ohio ave, Midland, TX", lat: 31.9973, lon: -102.0779, distance: 320, region: "West" },
  { name: "Garza County Museum", city: "Post", address: "119 n ave north, Post, TX", lat: 33.1912, lon: -101.3793, distance: 330, region: "Panhandle" },
  { name: "Hotel Texan", city: "Seagraves", address: "302 main st, Seagraves, TX", lat: 32.9434, lon: -102.5654, distance: 350, region: "West" },
  { name: "Alley Oop Land", city: "Iraan", address: "9261 alley oop lane, Iraan, TX", lat: 30.9147, lon: -101.8965, distance: 360, region: "West" },
  { name: "Bob Will's Tour Bus", city: "Turkey", address: "main st, Turkey, TX", lat: 34.3942, lon: -100.8979, distance: 370, region: "Panhandle" },
  { name: "The Studio Coffee", city: "Wheeler", address: "418 s main st, Wheeler, TX", lat: 35.4453, lon: -100.2743, distance: 390, region: "Panhandle" },
  
  // 401+ miles
  { name: "Antelope Creek Leather", city: "Borger", address: "227 n Harvey st, Borger, TX", lat: 35.6678, lon: -101.3974, distance: 410, region: "Panhandle" },
  { name: "Van Horn Mural (ALT)", city: "Van Horn", address: "105 w broadway st, Van Horn, TX", lat: 31.0404, lon: -104.8308, distance: 480, region: "Far West" },
  { name: "Prada Store (ALT)", city: "Valentine", address: "14880 us 90, Valentine, TX", lat: 30.5856, lon: -104.4822, distance: 520, region: "Far West" },
  { name: "Old Glory Memorial", city: "El Paso", address: "9550 gateway blvd n, El Paso, TX", lat: 31.7619, lon: -106.4850, distance: 580, region: "Far West" },
  { name: "Mayor of Lajitas", city: "Lajitas", address: "21709 fm170, Lajitas, TX", lat: 29.2669, lon: -103.7653, distance: 600, region: "Far West" }
];

  // Calculate distances based on selected starting city
  const startCoords = cityCoordinates[startCity as keyof typeof cityCoordinates];
  
  console.log('Start City:', startCity);
  console.log('Start Coords:', startCoords);
  console.log('First stop:', baseStops[0]);
  
  const stops = baseStops.map(stop => {
    const dist = calculateDistance(startCoords.lat, startCoords.lon, stop.lat, stop.lon);
    console.log(`Distance from ${startCity} to ${stop.city}: ${dist}`);
    return {
      name: stop.name,
      city: stop.city,
      address: stop.address,
      region: stop.region,
      distance: isNaN(dist) ? stop.distance : dist,
      lat: stop.lat,
      lon: stop.lon
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
            <div className="flex items-end">
              <div className="text-sm text-gray-400">
                Distances are calculated as straight-line ("as the crow flies") and will be slightly less than actual riding distances.
              </div>
            </div>
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

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              <Download size={18} />
              Export to CSV
            </button>
            <button
              onClick={copyAddressList}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
            >
              <MapPin size={18} />
              Copy Address List
            </button>
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

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-950">
                <tr>
                  <th className="px-4 py-3 text-left text-orange-500">#</th>
                  <th className="px-4 py-3 text-left text-orange-500">Stop Name</th>
                  <th className="px-4 py-3 text-left text-orange-500">City</th>
                  <th className="px-4 py-3 text-left text-orange-500">Address</th>
                  <th className="px-4 py-3 text-left text-orange-500">Distance</th>
                  <th className="px-4 py-3 text-left text-orange-500">Region</th>
                </tr>
              </thead>
              <tbody>
                {filteredStops.map((stop, idx) => (
                  <tr key={idx} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center justify-between">
                        <span>{stop.name}</span>
                        <button
                          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lon}`, '_blank')}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="View on Google Maps"
                        >
                          <Map size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{stop.city}</td>
                    <td className="px-4 py-3 text-gray-400 text-sm">{stop.address}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block ${getDistanceColor(stop.distance)} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {stop.distance} mi
                      </span>
                    </td>
                    <td className="px-4 py-3">
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
