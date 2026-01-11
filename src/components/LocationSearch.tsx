import { Component, createSignal, For, Show } from 'solid-js';
import { store } from '../store';
import type { Location } from '../types';

interface LocationSearchProps {
  onClose: () => void;
}

const LocationSearch: Component<LocationSearchProps> = (props) => {
  const { state, setLocation, searchLocations } = store;
  const [query, setQuery] = createSignal('');
  const [results, setResults] = createSignal<Location[]>([]);
  const [isSearching, setIsSearching] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  let searchTimeout: number | undefined;

  const handleSearch = (value: string) => {
    setQuery(value);
    setError(null);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    searchTimeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const locations = await searchLocations(value.trim());
        setResults(locations);
      } catch (e) {
        setError('Failed to search locations');
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleSelect = async (location: Location) => {
    await setLocation(location);
    props.onClose();
  };

  const formatLocation = (loc: Location) => {
    const parts = [loc.name];
    if (loc.admin1) parts.push(loc.admin1);
    if (loc.country) parts.push(loc.country);
    return parts.join(', ');
  };

  return (
    <div class="modal-overlay" onClick={props.onClose}>
      <div class="modal-content location-search" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>Search Location</h2>
          <button class="close-btn" onClick={props.onClose}>
            ✕
          </button>
        </div>

        <div class="modal-body">
          <div class="search-input-container">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for a city..."
              value={query()}
              onInput={(e) => handleSearch(e.currentTarget.value)}
              class="search-input"
              autofocus
            />
            <Show when={isSearching()}>
              <span class="loading-spinner">⏳</span>
            </Show>
          </div>

          <Show when={error()}>
            <div class="error-message">{error()}</div>
          </Show>

          <Show when={state.location}>
            <div class="current-location" onClick={() => handleSelect(state.location!)}>
              <span class="location-icon">📍</span>
              <span>Current: {state.location?.name}</span>
            </div>
          </Show>

          <div class="search-results">
            <For each={results()}>
              {(location) => (
                <div class="search-result-item" onClick={() => handleSelect(location)}>
                  <span class="result-icon">🏙️</span>
                  <span class="result-name">{formatLocation(location)}</span>
                </div>
              )}
            </For>
          </div>

          <Show when={query().length >= 2 && results().length === 0 && !isSearching()}>
            <div class="no-results">No locations found</div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;
