# 2026 Texas Motorcycle Grand Tour Stops

A mobile-friendly web app for planning and tracking your stops on the [Motorcycle Grand Tour of Texas](https://motorcyclegrandtouroftexas.com). Find stops near you, plan multi-stop routes, track your progress, and navigate directly from the app.

---

## Features

### 📍 Distance-Based Stop List
- All tour stops sorted by distance from your starting point
- Choose from 15 major Texas cities as your starting point, or use your current GPS location
- Distance displayed as straight-line miles (actual riding distance will be slightly longer)
- Color-coded distance badges: green (≤50mi), blue (≤150mi), yellow (≤250mi), orange (≤400mi), red (400mi+)

### 🗺️ Interactive Map
- OpenStreetMap-powered map showing all filtered stops
- Color-coded markers: green (visited), orange (unvisited), purple (selected for route), blue (your location or start city)
- Click any marker to open a popup with Navigate and Add to Route buttons

### 🛣️ Route Planner
- Select multiple stops and open them as a multi-stop route in Google Maps
- Automatically uses your current location as the starting point if available, otherwise uses your selected city
- Supports up to 10 stops with current location, or 11 stops without
- Selected route stops highlighted in purple on the map

### ✅ Progress Tracking
- Mark stops as visited with a single tap
- Progress bar showing visited vs total stops
- Milestone messages at 25 and 50 stops
- Progress saved to local storage — persists between sessions
- Filter list to show only unvisited stops

### 🔍 Filters & Search
- Search stops by name or city
- Filter by region (Hill Country, North, South, West, etc.)
- Slider to filter stops by maximum distance
- Sort by distance, name, or city

### 📤 Export Options
- Export visible stops to CSV for use in Excel or other route planners
- Copy a formatted address list to clipboard

---

## How to Use

### Setting Your Starting Point
1. Open the **Set Your Starting Location** section
2. Either select a city from the dropdown, or click **Use My Location** to use GPS
3. All distances and the map will update automatically
4. Click **Clear Location** to go back to city-based distances

### Navigating to a Stop
- Click the **map icon** next to any stop to open Google Maps with directions from your starting point

### Planning a Multi-Stop Route
1. Click **Plan Route** in the filters section to open the Route Planner
2. Check the box next to each stop you want to include
3. Selected stops appear in the route list in order
4. Click **Open Route in Google Maps** to launch the full route

### Tracking Progress
- Click the **checkmark icon** next to any stop to mark it as visited
- Your progress is shown in the **Your Progress** bar at the top
- Use **Unvisited Only** to hide stops you've already completed
- Submit your photos via the **Submit Tour Photos** link in the progress section

### Using the Map
- Click **Show Map** in the Stops Overview section
- Click any marker to see the stop name, city, distance, and action buttons
- **Navigate** opens Google Maps directions to that stop
- **+ Route** adds the stop to your route planner

---

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- npm v9 or higher

### Install & Run

```bash
# Clone the repository
git clone https://github.com/brandescm/MotorcycleGrandTourofTX-app.git
cd texas-moto-tour

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy to any static host (Netlify, Vercel, GitHub Pages, etc.).

### Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Global styles and visual theming
├── mobile.css       # Mobile-specific layout overrides
├── tourStops.ts     # Tour stop data and TourStop type definition
└── main.tsx         # App entry point
```

### Environment Notes
- No API keys required — uses OpenStreetMap (free) for the map and Nominatim (free) for reverse geocoding
- Google Maps routing is handled via URL parameters, no Maps API key needed
- Progress data is stored in `localStorage` — no backend required

---

## Tech Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com) — utility styling
- [Leaflet](https://leafletjs.com) via CDN — interactive map
- [Lucide React](https://lucide.dev) — icons
- [Nominatim](https://nominatim.org) — reverse geocoding (coordinates → address)
- [OpenStreetMap](https://www.openstreetmap.org) — map tiles

---

## Special Stops

These stops are not included in the main list but count toward your tour total:

- **VFW Posts** — Visit any VFW post, add to any convenient trip
- **Lone Star Rider's Van** — Traveling location, check the official site for current position
- **Alternate Stops (ALT)** — 5 alternates included in the list, can substitute for regular stops

---

## Links

- [Official Tour Site](https://motorcyclegrandtouroftexas.com)
- [Photo Submission Portal](https://motorcyclegrandtouroftexas.com/picture-submission-portal-2026-tour/)