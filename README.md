# Ultra Trail App

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
OPENWEATHER_API_KEY=your_api_key_here
```

Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)

## Deploy

Push to GitHub then import on Vercel.

## Features
- ✅ Training tracking
- ✅ Suunto import (mock parser)
- ✅ Nutrition strategy
- ✅ **Weather Dashboard** (NEW)
  - Real-time weather data from OpenWeatherMap
  - Search by city name
  - Use your current location
  - Trail condition recommendations
  - Current temperature, humidity, wind speed, pressure, visibility
  - Weather alerts and recommendations

## API Endpoints

- `GET /api/weather?lat=45&lon=6` - Get weather data for coordinates
- `GET /api/geocode?city=Paris` - Geocode city name to coordinates
- `GET /api/upload` - Suunto upload endpoint
