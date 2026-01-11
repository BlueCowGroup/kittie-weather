export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  description: string;
  isDay: boolean;
  uvIndex: number;
  visibility: number;
  pressure: number;
  precipitation: number;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  weatherCode: number;
  precipitation: number;
}

export interface DailyForecast {
  date: Date;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  precipitationProbability: number;
  sunrise: Date;
  sunset: Date;
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface CatPhoto {
  id: string;
  name: string;
  dataUrl: string;
  uploadedAt: Date;
}

export interface GeneratedCatImage {
  id: string;
  catPhotoId: string;
  weatherCondition: string;
  imageUrl: string;
  generatedAt: Date;
  prompt: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface AppState {
  currentWeather: WeatherData | null;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  location: Location | null;
  catPhotos: CatPhoto[];
  selectedCatId: string | null;
  generatedImages: GeneratedCatImage[];
  currentGeneratedImage: string | null;
  isLoading: boolean;
  error: string | null;
  aiApiKey: string | null;
  temperatureUnit: TemperatureUnit;
}

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';
