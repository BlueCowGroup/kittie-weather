import { Component, For, Show } from 'solid-js';
import { store } from '../store';
import WeatherIcon from './WeatherIcon';

const HourlyForecast: Component = () => {
  const { state } = store;

  const formatHour = (date: Date) => {
    const now = new Date();
    if (date.getHours() === now.getHours() && date.getDate() === now.getDate()) {
      return 'Now';
    }
    return date.toLocaleTimeString('en-US', { hour: 'numeric' });
  };

  return (
    <div class="weather-card hourly-forecast">
      <div class="card-header">
        <span class="card-icon">🕐</span>
        <span class="card-title">HOURLY FORECAST</span>
      </div>
      <div class="hourly-scroll">
        <For each={state.hourlyForecast.slice(0, 12)}>
          {(hour) => (
            <div class="hourly-item">
              <div class="hour-time">{formatHour(hour.time)}</div>
              <WeatherIcon
                code={hour.weatherCode}
                isDay={hour.time.getHours() >= 6 && hour.time.getHours() < 20}
                size="md"
              />
              <div class="hour-temp">{hour.temperature}°</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default HourlyForecast;
