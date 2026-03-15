export interface TourStop {
  name: string;
  city: string;
  address: string;
  lat: number;
  lon: number;
  distance: number;
  region: string;
  imageUrl: string;
}

export const baseStops: TourStop[] = [
  // Within 50 miles
  { 
    name: "Gus's Drug Mural", 
    city: "Georgetown", 
    address: "702 e university ave, Georgetown, TX", 
    lat: 30.6327, 
    lon: -97.6769, 
    distance: 25, 
    region: "Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-44.jpeg?ssl=1"
  },
  { 
    name: "Old Taylor High School", 
    city: "Taylor", 
    address: "410 west 7th st, Taylor, TX", 
    lat: 30.5705, 
    lon: -97.4094, 
    distance: 35, 
    region: "Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-33.jpeg?ssl=1"
  },
  { 
    name: "Dead Man's Hole", 
    city: "Marble Falls", 
    address: "county rd 401, Marble Falls, TX", 
    lat: 30.5783, 
    lon: -98.2714, 
    distance: 40, 
    region: "Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-1.jpeg?ssl=1"
  },
  { 
    name: "Hill Country Motorheads Museum", 
    city: "Burnet", 
    address: "2001 w state hwy 29, Burnet, TX", 
    lat: 30.7580, 
    lon: -98.2283, 
    distance: 40, 
    region: "Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-40.jpeg?ssl=1"
  },
  { 
    name: "Highland Lake Squadron", 
    city: "Burnet", 
    address: "2402 s water st, Burnet, TX", 
    lat: 30.7580, 
    lon: -98.2283, 
    distance: 40, 
    region: "Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-36.jpeg?ssl=1"
  },
  { 
    name: "The Gas Station", 
    city: "Bastrop", 
    address: "1073 tx 304, Bastrop, TX", 
    lat: 30.1102, 
    lon: -97.3152, 
    distance: 45, 
    region: "Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-41.jpeg?ssl=1"
  },
  { 
    name: "LBJ Boyhood Home", 
    city: "Johnson City", 
    address: "200 e elm st, Johnson City, TX", 
    lat: 30.2769, 
    lon: -98.4072, 
    distance: 48, 
    region: "Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-39.jpeg?ssl=1"
  },
  
  // 51-100 miles
  { 
    name: "Driftwood Store", 
    city: "Driftwood", 
    address: "fm 150, Driftwood, TX", 
    lat: 30.1069, 
    lon: -98.0308, 
    distance: 55, 
    region: "Hill Country",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-32.jpeg?ssl=1"
  },
  { 
    name: "Fischer Store", 
    city: "Fischer", 
    address: "4040 fm 484, Fischer, TX", 
    lat: 29.9697, 
    lon: -98.2536, 
    distance: 60, 
    region: "Hill Country",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-19.jpeg?ssl=1"
  },
  { 
    name: "Flying L Ranch Resort", 
    city: "Bandera", 
    address: "675 flying l drive, Bandera, TX", 
    lat: 29.7269, 
    lon: -99.0736, 
    distance: 70, 
    region: "Hill Country",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-10.jpeg?ssl=1"
  },
  { 
    name: "Waring General Store (ALT)", 
    city: "Waring", 
    address: "544 waring welfare rd, Waring, TX", 
    lat: 29.9406, 
    lon: -98.7814, 
    distance: 75, 
    region: "Hill Country",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/%E2%80%8EWARING-GENERAL-STORE.%E2%80%8E001-1.png?ssl=1"
  },
  { 
    name: "Castell General Store", 
    city: "Castell", 
    address: "19522 w ranch road 152, Castell, TX", 
    lat: 30.6769, 
    lon: -99.0914, 
    distance: 80, 
    region: "Hill Country",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-13.jpeg?ssl=1"
  },
  { 
    name: "The Shop", 
    city: "Waxahachie", 
    address: "315 w main st, suite 13, Waxahachie, TX", 
    lat: 32.3868, 
    lon: -96.8483, 
    distance: 95, 
    region: "North",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-47.jpeg?ssl=1"
  },
  { 
    name: "Frio Canyon Motorcycle Shop", 
    city: "Leakey", 
    address: "657 ranch road 337, Leakey, TX", 
    lat: 29.7289, 
    lon: -99.7608, 
    distance: 100, 
    region: "Hill Country",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-23.jpeg?ssl=1"
  },
  
  // 101-150 miles
  { 
    name: "Washington on the Brazos", 
    city: "Washington", 
    address: "23400 park road 12, Washington, TX", 
    lat: 30.3319, 
    lon: -96.1550, 
    distance: 105, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-11.jpeg?ssl=1"
  },
  { 
    name: "Blue Bell Creamery", 
    city: "Brenham", 
    address: "1101 south blue bell road, Brenham, TX", 
    lat: 30.1669, 
    lon: -96.3978, 
    distance: 110, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-12.jpeg?ssl=1"
  },
  { 
    name: "Classic Rock Cafe", 
    city: "Navasota", 
    address: "129 e Washington ave, Navasota, TX", 
    lat: 30.3880, 
    lon: -96.0878, 
    distance: 110, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-27.jpeg?ssl=1"
  },
  { 
    name: "Welcome General Store", 
    city: "Welcome", 
    address: "12528 fm109, Welcome, TX", 
    lat: 30.0347, 
    lon: -96.3478, 
    distance: 115, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-7.jpeg?ssl=1"
  },
  { 
    name: "Leona General Store", 
    city: "Leona", 
    address: "136 Leona blvd n, Leona, TX", 
    lat: 31.1569, 
    lon: -95.9653, 
    distance: 120, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-21.jpeg?ssl=1"
  },
  { 
    name: "Tex Miller's", 
    city: "Cameron", 
    address: "104 n fannin ave, Cameron, TX", 
    lat: 30.8530, 
    lon: -96.9708, 
    distance: 125, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-22.jpeg?ssl=1"
  },
  { 
    name: "Edge General Store", 
    city: "Hearne", 
    address: "7250 edge cut off road, Hearne, TX", 
    lat: 30.8786, 
    lon: -96.5928, 
    distance: 130, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-30.jpeg?ssl=1"
  },
  { 
    name: "Rosebud Historical Museum", 
    city: "Rosebud", 
    address: "117 n 2nd st, Rosebud, TX", 
    lat: 31.0764, 
    lon: -96.9786, 
    distance: 135, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-31.jpeg?ssl=1"
  },
  { 
    name: "Texas Sidecar Co", 
    city: "Teague", 
    address: "210 elm street, Teague, TX", 
    lat: 31.6236, 
    lon: -96.2831, 
    distance: 140, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-4.jpeg?ssl=1"
  },
  { 
    name: "Cindy Walker Mural", 
    city: "Mexia", 
    address: "McKinney st, Mexia, TX", 
    lat: 31.6797, 
    lon: -96.4822, 
    distance: 140, 
    region: "Central East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-46.jpeg?ssl=1"
  },
  { 
    name: "Motorcycle Gear", 
    city: "Plano", 
    address: "2637 Summit ave, Plano, TX", 
    lat: 33.0198, 
    lon: -96.6989, 
    distance: 145, 
    region: "North",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-2.jpeg?ssl=1"
  },
  { 
    name: "Moto Liberty", 
    city: "Addison", 
    address: "15402 midway road, Addison, TX", 
    lat: 32.9540, 
    lon: -96.8353, 
    distance: 145, 
    region: "North",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-6.jpeg?ssl=1"
  },
  { 
    name: "Riders Bike Supply", 
    city: "Lewisville", 
    address: "101 e southwest pkwy, Lewisville, TX", 
    lat: 33.0462, 
    lon: -96.9942, 
    distance: 145, 
    region: "North",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-37.jpeg?ssl=1"
  },
  { 
    name: "Welcome to Celina Mural", 
    city: "Celina", 
    address: "732 e pecan st, Celina, TX", 
    lat: 33.3245, 
    lon: -96.7845, 
    distance: 150, 
    region: "North",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-42.jpeg?ssl=1"
  },
  
  // 151-200 miles
  { 
    name: "Battle Creek Burial Ground", 
    city: "Dawson", 
    address: "state hwy 31, Dawson, TX", 
    lat: 31.8944, 
    lon: -96.7100, 
    distance: 155, 
    region: "Northeast",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-8.jpeg?ssl=1"
  },
  { 
    name: "Calaboose", 
    city: "Kemp", 
    address: "106 w 11th st, Kemp, TX", 
    lat: 32.4426, 
    lon: -96.2286, 
    distance: 160, 
    region: "Northeast",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-29.jpeg?ssl=1"
  },
  { 
    name: "Leonard Pharmacy", 
    city: "Leonard", 
    address: "122 w collin st, Leonard, TX", 
    lat: 33.3784, 
    lon: -96.2464, 
    distance: 165, 
    region: "Northeast",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-15.jpeg?ssl=1"
  },
  { 
    name: "Van Zandt County Vet Memorial (ALT)", 
    city: "Canton", 
    address: "1200 s trade days blvd, Canton, TX", 
    lat: 32.5568, 
    lon: -95.8630, 
    distance: 170, 
    region: "Northeast",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/%E2%80%8EALT-4-VAN-ZANDT-COUNTY-VET-MEM.%E2%80%8E001.png?ssl=1"
  },
  { 
    name: "Horny Toad Bar", 
    city: "Cranfills Gap", 
    address: "319 N 3rd st, Cranfills Gap, TX", 
    lat: 31.7711, 
    lon: -97.8233, 
    distance: 175, 
    region: "North Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-5.jpeg?ssl=1"
  },
  { 
    name: "Victoria County Courthouse", 
    city: "Victoria", 
    address: "101 n bridge st, Victoria, TX", 
    lat: 28.8053, 
    lon: -97.0036, 
    distance: 180, 
    region: "South",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-49.jpeg?ssl=1"
  },
  { 
    name: "Yorktown Memorial Hospital (ALT)", 
    city: "Yorktown", 
    address: "728 w main st, Yorktown, TX", 
    lat: 28.9811, 
    lon: -97.5028, 
    distance: 185, 
    region: "South",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Alt-5.jpeg?ssl=1"
  },
  
  // 201-250 miles
  { 
    name: "Gladewater Museum", 
    city: "Gladewater", 
    address: "w. pacific and dean, Gladewater, TX", 
    lat: 32.5368, 
    lon: -94.9427, 
    distance: 210, 
    region: "East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-18.jpeg?ssl=1"
  },
  { 
    name: "Herrman & Herrman", 
    city: "Corpus Christi", 
    address: "1201 3rd st, Corpus Christi, TX", 
    lat: 27.8006, 
    lon: -97.3964, 
    distance: 220, 
    region: "South",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-20.jpeg?ssl=1"
  },
  { 
    name: "Rusk KOA", 
    city: "Rusk", 
    address: "745 fm 343 east, Rusk, TX", 
    lat: 31.7957, 
    lon: -95.1508, 
    distance: 230, 
    region: "East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-43.jpeg?ssl=1"
  },
  { 
    name: "Fort Belknap", 
    city: "Newcastle", 
    address: "114 fort cir, Newcastle, TX", 
    lat: 33.1948, 
    lon: -98.7414, 
    distance: 240, 
    region: "North Central",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-26.jpeg?ssl=1"
  },
  
  // 251-300 miles
  { 
    name: "Jefferson General Store", 
    city: "Jefferson", 
    address: "113 e Austin st, Jefferson, TX", 
    lat: 32.7568, 
    lon: -94.3452, 
    distance: 270, 
    region: "East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-24.jpeg?ssl=1"
  },
  { 
    name: "Flying G Motorcycle Museum", 
    city: "Joaquin", 
    address: "10552 us 84, Joaquin, TX", 
    lat: 31.9650, 
    lon: -94.0497, 
    distance: 280, 
    region: "East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-48.jpeg?ssl=1"
  },
  { 
    name: "Museum of Gulf Coast", 
    city: "Port Arthur", 
    address: "700 procter st, Port Arthur, TX", 
    lat: 29.8988, 
    lon: -93.9402, 
    distance: 290, 
    region: "East",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-34.jpeg?ssl=1"
  },
  
  // 301-400 miles
  { 
    name: "Bush Family Home", 
    city: "Midland", 
    address: "1412 w ohio ave, Midland, TX", 
    lat: 31.9973, 
    lon: -102.0779, 
    distance: 320, 
    region: "West",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-38.jpeg?ssl=1"
  },
  { 
    name: "Garza County Museum", 
    city: "Post", 
    address: "119 n ave north, Post, TX", 
    lat: 33.1912, 
    lon: -101.3793, 
    distance: 330, 
    region: "Panhandle",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-28.jpeg?ssl=1"
  },
  { 
    name: "Hotel Texan", 
    city: "Seagraves", 
    address: "302 main st, Seagraves, TX", 
    lat: 32.9434, 
    lon: -102.5654, 
    distance: 350, 
    region: "West",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-45.jpeg?ssl=1"
  },
  { 
    name: "Alley Oop Land", 
    city: "Iraan", 
    address: "9261 alley oop lane, Iraan, TX", 
    lat: 30.9147, 
    lon: -101.8965, 
    distance: 360, 
    region: "West",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-9.jpeg?ssl=1"
  },
  { 
    name: "Bob Will's Tour Bus", 
    city: "Turkey", 
    address: "main st, Turkey, TX", 
    lat: 34.3942, 
    lon: -100.8979, 
    distance: 370, 
    region: "Panhandle",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-14.jpeg?ssl=1"
  },
  { 
    name: "The Studio Coffee", 
    city: "Wheeler", 
    address: "418 s main st, Wheeler, TX", 
    lat: 35.4453, 
    lon: -100.2743, 
    distance: 390, 
    region: "Panhandle",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-16.jpeg?ssl=1"
  },
  
  // 401+ miles
  { 
    name: "Antelope Creek Leather", 
    city: "Borger", 
    address: "227 n Harvey st, Borger, TX", 
    lat: 35.6678, 
    lon: -101.3974, 
    distance: 410, 
    region: "Panhandle",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-35.jpeg?ssl=1"
  },
  { 
    name: "Van Horn Mural (ALT)", 
    city: "Van Horn", 
    address: "105 w broadway st, Van Horn, TX", 
    lat: 31.0404, 
    lon: -104.8308, 
    distance: 480, 
    region: "Far West",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Alt-3.jpeg?ssl=1"
  },
  { 
    name: "Prada Store (ALT)", 
    city: "Valentine", 
    address: "14880 us 90, Valentine, TX", 
    lat: 30.5856, 
    lon: -104.4822, 
    distance: 520, 
    region: "Far West",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Alt-2.jpeg?ssl=1"
  },
  { 
    name: "Old Glory Memorial", 
    city: "El Paso", 
    address: "9550 gateway blvd n, El Paso, TX", 
    lat: 31.7619, 
    lon: -106.4850, 
    distance: 580, 
    region: "Far West",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-3.jpeg?ssl=1"
  },
  { 
    name: "Mayor of Lajitas", 
    city: "Lajitas", 
    address: "21709 fm170, Lajitas, TX", 
    lat: 29.2669, 
    lon: -103.7653, 
    distance: 600, 
    region: "Far West",
    imageUrl: "https://i0.wp.com/motorcyclegrandtouroftexas.com/wp-content/uploads/2025/12/Stop-17.jpeg?ssl=1"
  }
];