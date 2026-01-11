import type { CatPhoto, WeatherData } from '../types';
import { getWeatherCondition } from './weather';

interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  prompt?: string;
}

function buildPrompt(weather: WeatherData, catName: string): string {
  const condition = getWeatherCondition(weather.weatherCode);
  const timeOfDay = weather.isDay ? 'during the day' : 'at night';
  const temp = weather.temperature;

  const weatherDescriptions: Record<string, string> = {
    clear: weather.isDay
      ? 'a beautiful clear sunny day with blue skies'
      : 'a clear starry night sky',
    'partly-cloudy': weather.isDay
      ? 'a partly cloudy day with scattered clouds and sun'
      : 'a partly cloudy night with the moon peeking through',
    cloudy: 'an overcast cloudy sky',
    fog: 'a mysterious foggy atmosphere',
    drizzle: 'light drizzle and rain drops',
    rain: 'rainfall with rain drops visible',
    snow: 'snowfall with snowflakes gently falling',
    thunderstorm: 'a dramatic thunderstorm with lightning in the background',
  };

  const weatherDesc = weatherDescriptions[condition] || 'interesting weather';

  return `A cute cat named ${catName} enjoying ${weatherDesc} ${timeOfDay}. The temperature is ${temp}°C. The cat looks comfortable and photorealistic. Beautiful atmospheric lighting matching the weather conditions. High quality, detailed, professional pet photography style.`;
}

// Generate using OpenAI DALL-E API
async function generateWithOpenAI(
  apiKey: string,
  prompt: string,
  catPhotoDataUrl: string
): Promise<GenerationResult> {
  try {
    // For image editing with DALL-E, we use the images/generations endpoint
    // Note: DALL-E 3 doesn't support image input, so we describe the cat in the prompt
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    return {
      success: true,
      imageUrl: data.data[0].url,
      prompt,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      prompt,
    };
  }
}

// Generate using Stability AI API
async function generateWithStability(
  apiKey: string,
  prompt: string,
  catPhotoDataUrl: string
): Promise<GenerationResult> {
  try {
    // Convert data URL to blob for image-to-image
    const imageBlob = await fetch(catPhotoDataUrl).then((r) => r.blob());

    const formData = new FormData();
    formData.append('init_image', imageBlob);
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', '0.35');
    formData.append('text_prompts[0][text]', prompt);
    formData.append('text_prompts[0][weight]', '1');
    formData.append('cfg_scale', '7');
    formData.append('samples', '1');
    formData.append('steps', '30');

    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'application/json',
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate image');
    }

    const data = await response.json();
    const base64Image = data.artifacts[0].base64;

    return {
      success: true,
      imageUrl: `data:image/png;base64,${base64Image}`,
      prompt,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      prompt,
    };
  }
}

// Main generation function that tries different providers
export async function generateCatWeatherImage(
  catPhoto: CatPhoto,
  weather: WeatherData,
  apiKey: string,
  provider: 'openai' | 'stability' = 'openai'
): Promise<GenerationResult> {
  const prompt = buildPrompt(weather, catPhoto.name);

  if (provider === 'stability') {
    return generateWithStability(apiKey, prompt, catPhoto.dataUrl);
  }

  return generateWithOpenAI(apiKey, prompt, catPhoto.dataUrl);
}

// Demo mode - returns a placeholder based on weather
export function getDemoImage(weather: WeatherData): string {
  const condition = getWeatherCondition(weather.weatherCode);
  const isDay = weather.isDay;

  // Return themed placeholder images based on weather
  const placeholders: Record<string, string> = {
    clear: isDay
      ? 'https://placekitten.com/800/600?image=1'
      : 'https://placekitten.com/800/600?image=2',
    'partly-cloudy': 'https://placekitten.com/800/600?image=3',
    cloudy: 'https://placekitten.com/800/600?image=4',
    fog: 'https://placekitten.com/800/600?image=5',
    drizzle: 'https://placekitten.com/800/600?image=6',
    rain: 'https://placekitten.com/800/600?image=7',
    snow: 'https://placekitten.com/800/600?image=8',
    thunderstorm: 'https://placekitten.com/800/600?image=9',
  };

  return placeholders[condition] || 'https://placekitten.com/800/600?image=10';
}

export { buildPrompt };
