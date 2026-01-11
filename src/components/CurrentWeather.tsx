import { Component, Show } from 'solid-js';
import { store } from '../store';
import WeatherIcon from './WeatherIcon';

const CurrentWeather: Component = () => {
  const { state } = store;

  return (
    <Show when={state.currentWeather}>
      {(weather) => (
        <div class="current-weather">
          <div class="location-name">{state.location?.name || 'Unknown Location'}</div>
          <div class="temperature">{weather().temperature}°</div>
          <div class="description">{weather().description}</div>
          <div class="high-low">
            <Show when={state.dailyForecast[0]}>
              {(today) => (
                <>
                  H:{today().temperatureMax}° L:{today().temperatureMin}°
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
