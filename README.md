# 🚕 Casablanca Petit Taxi Rouge - Mobile Application

A mobile taxi booking application for Casablanca's red taxis, built with React Native and Expo.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.76-61dafb.svg)
![Expo](https://img.shields.io/badge/Expo-52-000020.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📱 App Overview

Complete red taxi booking simulation app for Casablanca featuring:
- 🗺️ Interactive map with real-time location
- 🚖 Simulation of 7 available taxis
- ⏰ Dynamic day/night pricing
- 📊 Persistent ride history
- ✨ Smooth and modern animations

## 📸 Screenshots

<div align="center">
  <img src="https://ik.imagekit.io/ses5xq9vra/1.jpg" alt="Main Map Screen" width="200"/>
  <img src="https://ik.imagekit.io/ses5xq9vra/2.jpg" alt="Booking Screen" width="200"/>
  <img src="https://ik.imagekit.io/ses5xq9vra/3.jpg" alt="Active Ride Screen" width="200"/>
  <img src="https://ik.imagekit.io/ses5xq9vra/4.jpg" alt="History Screen" width="200"/>
</div>

## 🎥 Demo Video

https://github.com/user-attachments/assets/5798d38d-2c6d-49d0-a5d6-64766216339e

## 🎯 Features

### Screen 1: Main Map
- Map centered on Casablanca
- Simulated user position (blue marker 📍)
- 7 available red taxis (animated red markers 🚕)
- "Book a Taxi" button
- Day/Night toggle to change pricing
- Quick access to history

### Screen 2: Booking
- Select pickup location (10 popular places)
- Select destination
- Automatic distance calculation (Haversine formula)
- Estimated price display (based on day/night rate)
- Estimated travel time
- "Confirm Booking" button

### Screen 3: Active Ride
- Map with simulated route
- Taxi marker moving towards you
- Ride timer
- Driver information (name, photo, rating)
- Real-time price counter
- Day/night indicator
- "Cancel" button

### Screen 4: History
- List of completed rides
- Details: date, time, route, price, duration, rate
- Swipe to delete with animation
- Statistics: total spent, number of rides
- Data persistence with AsyncStorage

## 📍 Popular Places in Casablanca

The app includes 10 iconic locations:
1. Mohammed V Airport
2. Casa-Voyageurs Station
3. Morocco Mall
4. Twin Center
5. Casablanca Marina
6. Hassan II Mosque
7. Habous Quarter
8. Ain Diab
9. Zerktouni Boulevard
10. Central Market

## 💰 Real Casablanca Taxi Rates

- **Daytime Rate (6am-8pm)**: 7.50 DH pickup + 1.50 DH/km
- **Nighttime Rate (8pm-6am)**: 7.50 DH pickup + 2.00 DH/km

## 🛠️ Technologies Used

### Core
- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - Screen navigation

### State & Data
- **Zustand** - Global state management
- **AsyncStorage** - Data persistence (history)

### UI & Animations
- **Lucide React** - Modern icons
- **React Native Reanimated** - Smooth animations
- **Tailwind CSS (NativeWind)** - Styling

### Calculations & Logic
- **Haversine Formula** - GPS distance calculation
- **Timer** - Ride duration simulation
- **Dynamic Price Calculation** - Based on distance and rate

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Expo Go (on mobile) or Android/iOS emulator

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/your-username/casablanca-taxi-app.git

# Navigate to the folder
cd casablanca-taxi-app

# Install dependencies
npm install
# or
yarn install

# Start the application
npx expo start
```

### Scan the QR Code
1. Open Expo Go on your phone
2. Scan the QR code displayed in the terminal
3. The app will launch automatically

## 🚀 Usage

### Book a Ride
1. On the main screen, tap "Book a Taxi"
2. Select your pickup location
3. Choose your destination
4. Check the estimated price and time
5. Confirm the booking
6. The ride starts automatically

### Change Rate
- Tap the ☀️ (day) or 🌙 (night) icon in the top right
- Prices adjust automatically

### View History
- Tap the history icon in the top left
- View your past rides
- Swipe left to delete a ride

## 📁 Project Structure

```
casablanca-taxi-app/
├── app/
│   ├── index.js              # Main entry point
│   ├── screens/
│   │   ├── MapScreen.js      # Main map screen
│   │   ├── BookingScreen.js  # Booking screen
│   │   ├── ActiveRide.js     # Active ride screen
│   │   └── HistoryScreen.js  # History screen
│   └── store/
│       └── useStore.js       # Zustand store
├── utils/
│   ├── calculations.js       # Calculation functions
│   └── storage.js            # AsyncStorage helpers
├── constants/
│   ├── places.js             # Casablanca locations
│   └── rates.js              # Day/night rates
├── assets/
│   └── images/               # Images and icons
├── package.json
└── README.md
```

## 🎨 Design & UI

- **Modern Design**: Clean and intuitive interface
- **Smooth Animations**: Natural transitions and movements
- **Responsive**: Adapts to all screen sizes
- **Colors**: Red (#EF4444) for taxis, day/night theme

## 🧪 Technical Features

### Distance Calculation (Haversine)
```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};
```

### Price Calculation
```javascript
const calculatePrice = (distance, isDayMode) => {
  const pickupFee = 7.50;
  const ratePerKm = isDayMode ? 1.50 : 2.00;
  return pickupFee + (distance * ratePerKm);
};
```

## 📊 Global State (Zustand)

```javascript
{
  isDayMode: true,           // Day/night mode
  activeRide: null,          // Current ride
  rideHistory: [],           // Ride history
  userLocation: {...}        // User position
}
```

## 💾 Data Persistence

Data is saved locally with AsyncStorage:
- Ride history
- User preferences
- Statistics

## 🔮 Future Improvements

- [ ] Integration with real mapping API
- [ ] Real user geolocation
- [ ] Push notifications for taxi arrival
- [ ] Complete dark mode
- [ ] Online payment
- [ ] Driver rating after ride
- [ ] Ride sharing
- [ ] Multi-language support (EN/FR/AR)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 👥 Authors

- **Marouane Akrich** - *Initial Development* - [marouaneakrich](https://github.com/marouaneakrich)

## 🙏 Acknowledgments

- Inspiration: Casablanca red taxis
- Design: Uber, Careem
- React Native Community
- Expo Team

## 📞 Contact

For questions or suggestions:
- Email: y.brox95@example.com
- GitHub: [@marouaneakrich](https://github.com/marouaneakrich)

---

⭐ **Don't forget to star this repo if it helped you!** ⭐

Made with ❤️ in Casablanca
