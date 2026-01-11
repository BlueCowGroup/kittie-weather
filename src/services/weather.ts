import type { WeatherData, HourlyForecast, DailyForecast, Location } from '../types';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1';

// WMO Weather interpretation codes
const weatherCodeDescriptions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export function getWeatherDescription(code: number): string {
  return weatherCodeDescriptions[code] || 'Unknown';
}

export function getWeatherCondition(code: number): string {
  if (code === 0) return 'clear';
  if (code <= 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67 || code >= 80 && code <= 82) return 'rain';
  if (code >= 71 && code <= 77 || code >= 85 && code <= 86) return 'snow';
  if (code >= 95) return 'thunderstorm';
  return 'cloudy';
}

export async function searchLocations(query: string): Promise<Location[]> {
  const response = await fetch(
    `${GEOCODING_BASE}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error('Failed to search locations');
  }

  const data = await response.json();

  if (!data.results) {
    return [];
  }

  return data.results.map((r: any) => ({
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }));
}

export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get location name
        try {
          const response = await fetch(
            `${GEOCODING_BASE}/search?name=&count=1&language=en&format=json&latitude=${latitude}&longitude=${longitude}`
          );

          // Fallback to coordinates if reverse geocoding fails
          resolve({
            name: 'Current Location',
            latitude,
            longitude,
          });
        } catch {
          resolve({
            name: 'Current Location',
            latitude,
            longitude,
          });
        }
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<{
  current: WeatherData;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',
      'uv_index',
      'visibility',
      'surface_pressure',
      'precipitation',
    ].join(','),
    hourly: ['temperature_2m', 'weather_code', 'precipitation'].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weather_code',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
    forecast_days: '10',
  });

  const response = await fetch(`${OPEN_METEO_BASE}/forecast?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  const current: WeatherData = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    windDirection: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
    description: getWeatherDescription(data.current.weather_code),
    isDay: data.current.is_day === 1,
    uvIndex: Math.round(data.current.uv_index || 0),
    visibility: Math.round((data.current.visibility || 10000) / 1000),
    pressure: Math.round(data.current.surface_pressure || 1013),
    precipitation: data.current.precipitation || 0,
  };

  // Get hourly data starting from current hour
  const now = new Date();
  const allHourly: HourlyForecast[] = data.hourly.time.map((time: string, i: number) => ({
    time: new Date(time),
    temperature: Math.round(data.hourly.temperature_2m[i]),
    weatherCode: data.hourly.weather_code[i],
    precipitation: data.hourly.precipitation[i] || 0,
  }));

  // Filter to hours from now onwards and take next 24 hours
  const hourly = allHourly.filter((h) => h.time >= now).slice(0, 24);

  const daily: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
    date: new Date(date),
    temperatureMax: Math.round(data.daily.temperature_2m_max[i]),
    temperatureMin: Math.round(data.daily.temperature_2m_min[i]),
    weatherCode: data.daily.weather_code[i],
    precipitationProbability: data.daily.precipitation_probability_max[i] || 0,
    sunrise: new Date(data.daily.sunrise[i]),
    sunset: new Date(data.daily.sunset[i]),
  }));

  return { current, hourly, daily };
}
