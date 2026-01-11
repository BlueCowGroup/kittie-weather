import { Component, Show, createMemo } from 'solid-js';
import { store } from '../store';
import { getWeatherCondition } from '../services/weather';

const CatBackground: Component = () => {
  const { state, isGeneratingImage } = store;

  const gradientClass = createMemo(() => {
    if (!state.currentWeather) return 'gradient-clear-day';

    const condition = getWeatherCondition(state.currentWeather.weatherCode);
    const isDay = state.currentWeather.isDay;

    const gradients: Record<string, string> = {
      clear: isDay ? 'gradient-clear-day' : 'gradient-clear-night',
      'partly-cloudy': isDay ? 'gradient-cloudy-day' : 'gradient-cloudy-night',
      cloudy: 'gradient-overcast',
      fog: 'gradient-fog',
      drizzle: 'gradient-rain',
      rain: 'gradient-rain',
      snow: 'gradient-snow',
      thunderstorm: 'gradient-storm',
    };

    return gradients[condition] || 'gradient-clear-day';
  });

  return (
    <div class={`cat-background ${gradientClass()}`}>
      <Show when={state.currentGeneratedImage}>
        <div class="cat-image-container">
          <img
            src={state.currentGeneratedImage!}
            alt="Your cat in current weather"
            class="cat-image"
          />
          <Show when={isGeneratingImage()}>
            <div class="generating-overlay">
              <div class="generating-spinner"></div>
              <span>Generating cat image...</span>
            </div>
          </Show>
        </div>
      </Show>
      <Show when={!state.currentGeneratedImage && !state.catPhotos.length}>
        <div class="cat-placeholder">
          <div class="placeholder-icon">🐱</div>
          <p>Add your cat photo to see them here!</p>
        </div>
      </Show>
      <div class="gradient-overlay"></div>
    </div>
  );
};

export default CatBackground;
