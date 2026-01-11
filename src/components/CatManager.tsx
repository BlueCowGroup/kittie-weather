import { Component, createSignal, For, Show } from 'solid-js';
import { store } from '../store';

interface CatManagerProps {
  onClose: () => void;
}

const CatManager: Component<CatManagerProps> = (props) => {
  const { state, addCatPhoto, removeCatPhoto, selectCat } = store;
  const [catName, setCatName] = createSignal('');
  const [isUploading, setIsUploading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  let fileInputRef: HTMLInputElement | undefined;

  const handleFileSelect = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    const name = catName().trim() || 'My Cat';
    setIsUploading(true);
    setError(null);

    try {
      await addCatPhoto(file, name);
      setCatName('');
      input.value = '';
    } catch (e) {
      setError('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (id: string, e: Event) => {
    e.stopPropagation();
    if (confirm('Remove this cat photo?')) {
      removeCatPhoto(id);
    }
  };

  return (
    <div class="modal-overlay" onClick={props.onClose}>
      <div class="modal-content cat-manager" onClick={(e) => e.stopPropagation()}>
        <div class="modal-header">
          <h2>My Cats</h2>
          <button class="close-btn" onClick={props.onClose}>
            ✕
          </button>
        </div>

        <div class="modal-body">
          <div class="upload-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <input
              type="text"
              placeholder="Cat's name"
              value={catName()}
              onInput={(e) => setCatName(e.currentTarget.value)}
              class="cat-name-input"
            />
            <button
              class="upload-btn"
              onClick={() => fileInputRef?.click()}
              disabled={isUploading()}
            >
              {isUploading() ? 'Uploading...' : '📷 Add Cat Photo'}
            </button>
          </div>

          <Show when={error()}>
            <div class="error-message">{error()}</div>
          </Show>

          <div class="cats-grid">
            <For each={state.catPhotos}>
              {(cat) => (
                <div
                  class={`cat-card ${state.selectedCatId === cat.id ? 'selected' : ''}`}
                  onClick={() => selectCat(cat.id)}
                >
                  <img src={cat.dataUrl} alt={cat.name} class="cat-photo" />
                  <div class="cat-info">
                    <span class="cat-name">{cat.name}</span>
                    <button class="remove-cat-btn" onClick={(e) => handleRemove(cat.id, e)}>
                      🗑️
                    </button>
                  </div>
                  <Show when={state.selectedCatId === cat.id}>
                    <div class="selected-badge">✓ Active</div>
                  </Show>
                </div>
              )}
            </For>
          </div>

          <Show when={state.catPhotos.length === 0}>
            <div class="empty-state">
              <div class="empty-icon">🐱</div>
              <p>No cats added yet!</p>
              <p class="empty-hint">Upload a photo of your cat to see them in different weather!</p>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};

export default CatManager;
