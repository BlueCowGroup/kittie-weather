import { Component, createSignal, Show } from 'solid-js';
import { store } from '../store';

declare const __BUILD_TIMESTAMP__: string;

const formatBuildDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

interface SettingsProps {
  onClose: () => void;
}

const Settings: Component<SettingsProps> = (props) => {
  const { state, setAiApiKey, generateNewCatImage } = store;
  const buildDate = formatBuildDate(__BUILD_TIMESTAMP__);
  const [apiKey, setApiKey] = createSignal(state.aiApiKey || '');
  const [showKey, setShowKey] = createSignal(false);
  const [saved, setSaved] = createSignal(false);

  const handleSave = () => {
    const key = apiKey().trim();
    setAiApiKey(key || null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Trigger image generation if we have a cat and weather
    if (key && state.selectedCatId && state.currentWeather) {
      generateNewCatImage(key);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setAiApiKey(null);
  };

  return (
    <div class="modal-overlay" onClick={props.onClose}>
      <div class="modal-content settings" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>Settings</h2>
          <button class="close-btn" onClick={props.onClose}>
            ✕
          </button>
        </div>

        <div class="modal-body">
          <div class="settings-section">
            <h3>AI Image Generation</h3>
            <p class="settings-description">
              Enter your OpenAI API key to generate custom images of your cat in different weather
              conditions. Without an API key, your cat's original photo will be displayed.
            </p>

            <div class="api-key-input-container">
              <input
                type={showKey() ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey()}
                onInput={(e) => setApiKey(e.currentTarget.value)}
                class="api-key-input"
              />
              <button class="toggle-visibility-btn" onClick={() => setShowKey(!showKey())}>
                {showKey() ? '🙈' : '👁️'}
              </button>
            </div>

            <div class="settings-actions">
              <button class="save-btn" onClick={handleSave}>
                {saved() ? '✓ Saved!' : 'Save API Key'}
              </button>
              <Show when={apiKey()}>
                <button class="clear-btn" onClick={handleClear}>
                  Clear
                </button>
              </Show>
            </div>

            <div class="api-key-info">
              <h4>How to get an API key:</h4>
              <ol>
                <li>
                  Go to{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">
                    platform.openai.com/api-keys
                  </a>
                </li>
                <li>Create a new secret key</li>
                <li>Copy and paste it here</li>
              </ol>
              <p class="security-note">
                🔒 Your API key is stored locally on your device and never sent to our servers.
              </p>
            </div>
          </div>

          <div class="settings-section">
            <h3>About Kittie Weather</h3>
            <p class="about-text">
              Kittie Weather combines real-time weather data with AI-generated images of your cat,
              creating a personalized weather experience.
            </p>
            <p class="version-text">Build: {buildDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
