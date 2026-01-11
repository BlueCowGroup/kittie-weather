import { Component, For, Show } from 'solid-js';
import { store } from '../store';
import WeatherIcon from './WeatherIcon';

const DailyForecast: Component = () => {
  const { state } = store;

  const formatDay = (date: Date, index: number) => {
    if (index === 0) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getTempRange = () => {
    const temps = state.dailyForecast.flatMap((d) => [d.temperatureMin, d.temperatureMax]);
    return {
      min: Math.min(...temps),
      max: Math.max(...temps),
    };
  };

  const getBarStyle = (min: number, max: number) => {
    const range = getTempRange();
    const totalRange = range.max - range.min || 1;
    const left = ((min - range.min) / totalRange) * 100;
    const width = ((max - min) / totalRange) * 100;

    return {
      left: `${left}%`,
      width: `${Math.max(width, 10)}%`,
    };
  };

  return (
    <div class="weather-card daily-forecast">
      <div class="card-header">
        <span class="card-icon">📅</span>
        <span class="card-title">10-DAY FORECAST</span>
      </div>
      <div class="daily-list">
        <For each={state.dailyForecast}>
          {(day, index) => (
            <div class="daily-item">
              <div class="day-name">{formatDay(day.date, index())}</div>
              <div class="day-icon">
                <WeatherIcon code={day.weatherCode} size="md" />
              </div>
              <div class="day-temp-low">{day.temperatureMin}°</div>
              <div class="temp-bar-container">
                <div
                  class="temp-bar"
                  style={getBarStyle(day.temperatureMin, day.temperatureMax)}
                />
              </div>
              <div class="day-temp-high">{day.temperatureMax}°</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default DailyForecast;
