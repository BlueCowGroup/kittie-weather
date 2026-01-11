import { Component, Show } from 'solid-js';
import { store } from '../store';
import { convertTemperature } from '../utils/temperature';

const WeatherDetails: Component = () => {
  const { state } = store;

  const temp = (celsius: number) => convertTemperature(celsius, state.temperatureUnit);

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getUVDescription = (uv: number) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <Show when={state.currentWeather}>
      {(weather) => (
        <div class="weather-details-grid">
          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-icon">🌡️</span>
              <span class="detail-label">FEELS LIKE</span>
            </div>
            <div class="detail-value">{temp(weather().feelsLike)}°</div>
            <div class="detail-note">
              {weather().feelsLike > weather().temperature
                ? 'Humidity is making it feel warmer'
                : weather().feelsLike < weather().temperature
                  ? 'Wind is making it feel cooler'
                  : 'Similar to the actual temperature'}
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-icon">💧</span>
              <span class="detail-label">HUMIDITY</span>
            </div>
            <div class="detail-value">{weather().humidity}%</div>
            <div class="detail-note">
              {weather().humidity > 70
                ? 'High humidity levels'
                : weather().humidity < 30
                  ? 'Low humidity levels'
                  : 'Comfortable humidity'}
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-icon">💨</span>
              <span class="detail-label">WIND</span>
            </div>
            <div class="detail-value">
              {weather().windSpeed} <span class="unit">km/h</span>
            </div>
            <div class="detail-note">{getWindDirection(weather().windDirection)}</div>
          </div>

          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-icon">☀️</span>
              <span class="detail-label">UV INDEX</span>
            </div>
            <div class="detail-value">{weather().uvIndex}</div>
            <div class="detail-note">{getUVDescription(weather().uvIndex)}</div>
          </div>

          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-icon">👁️</span>
              <span class="detail-label">VISIBILITY</span>
            </div>
            <div class="detail-value">
              {weather().visibility} <span class="unit">km</span>
            </div>
            <div class="detail-note">
              {weather().visibility >= 10 ? 'Perfectly clear' : 'Reduced visibility'}
            </div>
          </div>

          <div class="detail-card">
            <div class="detail-header">
              <span class="detail-icon">🔽</span>
              <span class="detail-label">PRESSURE</span>
            </div>
            <div class="detail-value">
              {weather().pressure} <span class="unit">hPa</span>
            </div>
            <div class="detail-note">
              {weather().pressure > 1020
                ? 'High pressure'
                : weather().pressure < 1010
                  ? 'Low pressure'
                  : 'Normal pressure'}
            </div>
          </div>
        </div>
      )}
    </Show>
  );
};

export default WeatherDetails;
