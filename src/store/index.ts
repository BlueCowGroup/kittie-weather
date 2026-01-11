import { createSignal, createEffect, createRoot } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import type { AppState, CatPhoto, Location, GeneratedCatImage } from '../types';
import {
  loadCatPhotos,
  saveCatPhotos,
  loadSelectedCat,
  saveSelectedCat,
  loadGeneratedImages,
  saveGeneratedImages,
  loadLocation,
  saveLocation,
  loadAiApiKey,
  saveAiApiKey,
  generateId,
  compressImage,
} from '../services/storage';
import { fetchWeather, getCurrentLocation, searchLocations } from '../services/weather';
import { generateCatWeatherImage, getDemoImage } from '../services/imageGeneration';

function createAppStore() {
  const [state, setState] = createStore<AppState>({
    currentWeather: null,
    hourlyForecast: [],
    dailyForecast: [],
    location: loadLocation(),
    catPhotos: loadCatPhotos(),
    selectedCatId: loadSelectedCat(),
    generatedImages: loadGeneratedImages(),
    currentGeneratedImage: null,
    isLoading: false,
    error: null,
    aiApiKey: loadAiApiKey(),
  });

  const [isGeneratingImage, setIsGeneratingImage] = createSignal(false);

  // Actions
  async function initializeWeather() {
    setState('isLoading', true);
    setState('error', null);

    try {
      let location = state.location;

      if (!location) {
        try {
          location = await getCurrentLocation();
          setState('location', location);
          saveLocation(location);
        } catch (e) {
          // Default to a location if geolocation fails
          location = {
            name: 'New York',
            latitude: 40.7128,
            longitude: -74.006,
          };
          setState('location', location);
        }
      }

      const weather = await fetchWeather(location.latitude, location.longitude);
      setState('currentWeather', weather.current);
      setState('hourlyForecast', weather.hourly);
      setState('dailyForecast', weather.daily);

      // Generate or load cat image for current weather
      await updateCatImage();
    } catch (error) {
      setState('error', error instanceof Error ? error.message : 'Failed to load weather');
    } finally {
      setState('isLoading', false);
    }
  }

  async function setLocation(location: Location) {
    setState('location', location);
    saveLocation(location);
    await refreshWeather();
  }

  async function refreshWeather() {
    if (!state.location) return;

    setState('isLoading', true);
    setState('error', null);

    try {
      const weather = await fetchWeather(state.location.latitude, state.location.longitude);
      setState('currentWeather', weather.current);
      setState('hourlyForecast', weather.hourly);
      setState('dailyForecast', weather.daily);
      await updateCatImage();
    } catch (error) {
      setState('error', error instanceof Error ? error.message : 'Failed to refresh weather');
    } finally {
      setState('isLoading', false);
    }
  }

  async function addCatPhoto(file: File, name: string) {
    try {
      const dataUrl = await compressImage(file);
      const photo: CatPhoto = {
        id: generateId(),
        name,
        dataUrl,
        uploadedAt: new Date(),
      };

      setState(
        produce((s) => {
          s.catPhotos.push(photo);
        })
      );
      saveCatPhotos(state.catPhotos);

      // Auto-select if first cat
      if (state.catPhotos.length === 1) {
        selectCat(photo.id);
      }

      return photo;
    } catch (error) {
      throw new Error('Failed to process image');
    }
  }

  function removeCatPhoto(id: string) {
    setState(
      produce((s) => {
        s.catPhotos = s.catPhotos.filter((p) => p.id !== id);
        s.generatedImages = s.generatedImages.filter((i) => i.catPhotoId !== id);
      })
    );
    saveCatPhotos(state.catPhotos);
    saveGeneratedImages(state.generatedImages);

    if (state.selectedCatId === id) {
      const newSelected = state.catPhotos[0]?.id || null;
      selectCat(newSelected);
    }
  }

  function selectCat(id: string | null) {
    setState('selectedCatId', id);
    saveSelectedCat(id);
    updateCatImage();
  }

  async function updateCatImage() {
    if (!state.currentWeather) {
      setState('currentGeneratedImage', null);
      return;
    }

    const selectedCat = state.catPhotos.find((p) => p.id === state.selectedCatId);

    if (!selectedCat) {
      // Use demo image if no cat selected
      const demoImage = getDemoImage(state.currentWeather);
      setState('currentGeneratedImage', demoImage);
      return;
    }

    // Check for cached generated image
    const weatherCondition = state.currentWeather.description;
    const cached = state.generatedImages.find(
      (i) =>
        i.catPhotoId === selectedCat.id &&
        i.weatherCondition === weatherCondition &&
        Date.now() - new Date(i.generatedAt).getTime() < 3600000 // 1 hour cache
    );

    if (cached) {
      setState('currentGeneratedImage', cached.imageUrl);
      return;
    }

    // Use cat's original photo as placeholder until AI generates new one
    setState('currentGeneratedImage', selectedCat.dataUrl);

    // If we have an API key, try to generate
    if (state.aiApiKey) {
      await generateNewCatImage();
    }
  }

  async function generateNewCatImage(apiKeyOverride?: string) {
    const selectedCat = state.catPhotos.find((p) => p.id === state.selectedCatId);
    const apiKey = apiKeyOverride || state.aiApiKey;
    if (!selectedCat || !state.currentWeather || !apiKey) return;

    setIsGeneratingImage(true);
    setState('error', null);

    try {
      const result = await generateCatWeatherImage(
        selectedCat,
        state.currentWeather,
        apiKey,
        'openai',
        state.location || undefined
      );

      if (result.success && result.imageUrl) {
        const generated: GeneratedCatImage = {
          id: generateId(),
          catPhotoId: selectedCat.id,
          weatherCondition: state.currentWeather.description,
          imageUrl: result.imageUrl,
          generatedAt: new Date(),
          prompt: result.prompt || '',
        };

        setState(
          produce((s) => {
            s.generatedImages.push(generated);
            s.currentGeneratedImage = generated.imageUrl;
          })
        );
        saveGeneratedImages(state.generatedImages);
      } else if (result.error) {
        setState('error', `Image generation failed: ${result.error}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState('error', `Image generation failed: ${message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  }

  function setAiApiKey(key: string | null) {
    setState('aiApiKey', key);
    if (key) {
      saveAiApiKey(key);
    }
  }

  function clearError() {
    setState('error', null);
  }

  return {
    state,
    isGeneratingImage,
    initializeWeather,
    setLocation,
    refreshWeather,
    addCatPhoto,
    removeCatPhoto,
    selectCat,
    generateNewCatImage,
    setAiApiKey,
    clearError,
    searchLocations,
  };
}

// Create singleton store
export const store = createRoot(createAppStore);
