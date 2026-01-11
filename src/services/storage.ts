import type { CatPhoto, GeneratedCatImage, Location } from '../types';

const STORAGE_KEYS = {
  CAT_PHOTOS: 'kittie_weather_cats',
  SELECTED_CAT: 'kittie_weather_selected_cat',
  GENERATED_IMAGES: 'kittie_weather_generated',
  LOCATION: 'kittie_weather_location',
  AI_API_KEY: 'kittie_weather_ai_key',
};

export function saveCatPhotos(photos: CatPhoto[]): void {
  localStorage.setItem(STORAGE_KEYS.CAT_PHOTOS, JSON.stringify(photos));
}

export function loadCatPhotos(): CatPhoto[] {
  const data = localStorage.getItem(STORAGE_KEYS.CAT_PHOTOS);
  if (!data) return [];

  try {
    const photos = JSON.parse(data);
    return photos.map((p: any) => ({
      ...p,
      uploadedAt: new Date(p.uploadedAt),
    }));
  } catch {
    return [];
  }
}

export function saveSelectedCat(catId: string | null): void {
  if (catId) {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CAT, catId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_CAT);
  }
}

export function loadSelectedCat(): string | null {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_CAT);
}

export function saveGeneratedImages(images: GeneratedCatImage[]): void {
  // Only keep last 20 generated images to save storage
  const toSave = images.slice(-20);
  localStorage.setItem(STORAGE_KEYS.GENERATED_IMAGES, JSON.stringify(toSave));
}

export function loadGeneratedImages(): GeneratedCatImage[] {
  const data = localStorage.getItem(STORAGE_KEYS.GENERATED_IMAGES);
  if (!data) return [];

  try {
    const images = JSON.parse(data);
    return images.map((i: any) => ({
      ...i,
      generatedAt: new Date(i.generatedAt),
    }));
  } catch {
    return [];
  }
}

export function saveLocation(location: Location): void {
  localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
}

export function loadLocation(): Location | null {
  const data = localStorage.getItem(STORAGE_KEYS.LOCATION);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveAiApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEYS.AI_API_KEY, key);
}

export function loadAiApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEYS.AI_API_KEY);
}

export function clearAiApiKey(): void {
  localStorage.removeItem(STORAGE_KEYS.AI_API_KEY);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export async function compressImage(file: File, maxWidth: number = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
