# Kittie Weather

A Progressive Web App (PWA) that combines real-time weather data with AI-generated images of your cat in different weather conditions. Built with SolidJS for a fast, reactive experience inspired by the Apple Weather app.

## Features

- **Real-time Weather Data**: Get current conditions, hourly forecasts, and 10-day forecasts using the Open-Meteo API
- **Cat Photo Upload**: Upload photos of your cat(s) and select which one to display
- **AI Image Generation**: Generate custom images of your cat enjoying the current weather using OpenAI's DALL-E or Stability AI
- **Apple Weather-Inspired UI**: Beautiful, responsive design with weather-appropriate gradients and glass-morphism effects
- **PWA Support**: Install on your device for offline access and native-like experience
- **Location Search**: Search for any city worldwide to check weather conditions
- **Geolocation**: Automatically detect your current location

## Tech Stack

- **Framework**: [SolidJS](https://www.solidjs.com/) - Fast, reactive UI framework
- **Build Tool**: [Vite](https://vitejs.dev/) - Next-generation frontend tooling
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) - Zero-config PWA for Vite
- **Weather API**: [Open-Meteo](https://open-meteo.com/) - Free weather API
- **AI Image Generation**: OpenAI DALL-E 3 or Stability AI

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kittie-weather.git
   cd kittie-weather
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adding Your Cat

1. Click the cat icon in the header
2. Enter your cat's name
3. Click "Add Cat Photo" and select an image
4. Your cat will appear as the background with weather-appropriate styling

### Setting Up AI Image Generation

1. Click the settings icon in the header
2. Enter your OpenAI API key
3. Click "Save API Key"
4. The app will generate custom images of your cat based on current weather

To get an OpenAI API key:
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new secret key
3. Copy and paste it into the settings

### Changing Location

1. Click the search icon in the header
2. Type a city name
3. Select from the search results

## Project Structure

```
kittie-weather/
├── public/               # Static assets and PWA icons
├── src/
│   ├── components/       # SolidJS components
│   │   ├── CatBackground.tsx
│   │   ├── CatManager.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── LocationSearch.tsx
│   │   ├── Settings.tsx
│   │   ├── WeatherDetails.tsx
│   │   └── WeatherIcon.tsx
│   ├── services/         # API and storage services
│   │   ├── imageGeneration.ts
│   │   ├── storage.ts
│   │   └── weather.ts
│   ├── store/            # State management
│   │   └── index.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   ├── index.css         # Global styles
│   └── index.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Privacy

- All cat photos are stored locally in your browser's localStorage
- Your API key is stored locally and never sent to any third-party servers
- Location data is used only to fetch weather information
- No analytics or tracking

## License

MIT License
