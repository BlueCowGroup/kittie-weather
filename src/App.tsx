import { Component, createSignal, onMount, Show } from 'solid-js';
import { store } from './store';
import CatBackground from './components/CatBackground';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherDetails from './components/WeatherDetails';
import CatManager from './components/CatManager';
import LocationSearch from './components/LocationSearch';
import Settings from './components/Settings';

const App: Component = () => {
  const { state, initializeWeather, refreshWeather, clearError } = store;

  const [showCatManager, setShowCatManager] = createSignal(false);
  const [showLocationSearch, setShowLocationSearch] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [isRefreshing, setIsRefreshing] = createSignal(false);

  onMount(() => {
    initializeWeather();
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshWeather();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handlePullToRefresh = (e: TouchEvent) => {
    // Simple pull-to-refresh detection
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop === 0 && e.touches[0].clientY > 100) {
      handleRefresh();
    }
  };

  return (
    <div class="app" onTouchEnd={handlePullToRefresh as any}>
      <CatBackground />

      <header class="app-header">
        <button class="header-btn" onClick={() => setShowLocationSearch(true)} title="Search Location">
          🔍
        </button>
        <button
          class={`header-btn ${isRefreshing() ? 'spinning' : ''}`}
          onClick={handleRefresh}
          title="Refresh Weather"
        >
          🔄
        </button>
        <button class="header-btn" onClick={() => setShowCatManager(true)} title="Manage Cats">
          🐱
        </button>
        <button class="header-btn" onClick={() => setShowSettings(true)} title="Settings">
          ⚙️
        </button>
      </header>

      <main class="main-content">
        <Show when={state.isLoading && !state.currentWeather}>
          <div class="loading-screen">
            <div class="loading-spinner-large"></div>
            <p>Loading weather...</p>
          </div>
        </Show>

        <Show when={state.error}>
          <div class="error-banner" onClick={clearError}>
            <span class="error-icon">⚠️</span>
            <span>{state.error}</span>
            <button class="dismiss-btn">✕</button>
          </div>
        </Show>

        <Show when={state.currentWeather}>
          <section class="hero-section">
            <CurrentWeather />
          </section>

          <section class="forecast-section">
            <HourlyForecast />
            <DailyForecast />
            <WeatherDetails />
          </section>
        </Show>
      </main>

      <footer class="app-footer">
        <Show when={state.catPhotos.length > 0}>
          <div class="active-cat-indicator">
            {state.selectedCatId
              ? `Showing: ${state.catPhotos.find((c) => c.id === state.selectedCatId)?.name || 'Unknown'}`
              : 'No cat selected'}
          </div>
        </Show>
        <div class="weather-attribution">Weather data by Open-Meteo</div>
      </footer>

      <Show when={showCatManager()}>
        <CatManager onClose={() => setShowCatManager(false)} />
      </Show>

      <Show when={showLocationSearch()}>
        <LocationSearch onClose={() => setShowLocationSearch(false)} />
      </Show>

      <Show when={showSettings()}>
        <Settings onClose={() => setShowSettings(false)} />
      </Show>
    </div>
  );
};

export default App;
