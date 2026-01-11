import { Component, For, Show } from 'solid-js';
import { store } from '../store';
import WeatherIcon from './WeatherIcon';
import { convertTemperature } from '../utils/temperature';

const DailyForecast: Component = () => {
  const { state } = store;

  const temp = (celsius: number) => convertTemperature(celsius, state.temperatureUnit);

  const formatDay = (date: Date, index: number) => {
    if (index === 0) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getTempRange = () => {
    const temps = state.dailyForecast.flatMap((d) => [
      convertTemperature(d.temperatureMin, state.temperatureUnit),
      convertTemperature(d.temperatureMax, state.temperatureUnit),
    ]);
    return {
      min: Math.min(...temps),
      max: Math.max(...temps),
    };
  };

  const getBarStyle = (minCelsius: number, maxCelsius: number) => {
    const range = getTempRange();
    const min = convertTemperature(minCelsius, state.temperatureUnit);
    const max = convertTemperature(maxCelsius, state.temperatureUnit);
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
              <div class="day-temp-low">{temp(day.temperatureMin)}°</div>
              <div class="temp-bar-container">
                <div
                  class="temp-bar"
                  style={getBarStyle(day.temperatureMin, day.temperatureMax)}
                />
              </div>
              <div class="day-temp-high">{temp(day.temperatureMax)}°</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default DailyForecast;
