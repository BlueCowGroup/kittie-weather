import { Component, Show } from 'solid-js';
import { store } from '../store';
import WeatherIcon from './WeatherIcon';
import { convertTemperature } from '../utils/temperature';

const CurrentWeather: Component = () => {
  const { state } = store;

  const temp = (celsius: number) => convertTemperature(celsius, state.temperatureUnit);

  return (
    <Show when={state.currentWeather}>
      {(weather) => (
        <div class="current-weather">
          <div class="location-name">{state.location?.name || 'Unknown Location'}</div>
          <div class="temperature">{temp(weather().temperature)}°</div>
          <div class="description">{weather().description}</div>
          <div class="high-low">
            <Show when={state.dailyForecast[0]}>
              {(today) => (
                <>
                  H:{temp(today().temperatureMax)}° L:{temp(today().temperatureMin)}°
                </>
              )}
            </Show>
          </div>
        </div>
      )}
    </Show>
  );
};

export default CurrentWeather;
