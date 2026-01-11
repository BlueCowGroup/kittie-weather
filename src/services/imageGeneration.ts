import type { CatPhoto, WeatherData, Location } from '../types';
import { getWeatherCondition } from './weather';

interface GenerationResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  prompt?: string;
}

interface PromptContext {
  weather: WeatherData;
  catName: string;
  location: Location;
}

// Location-based scene settings
function getLocationScene(location: Location, weather: WeatherData): string {
  const name = (location.name || '').toLowerCase();
  const isCoastal = /beach|bay|coast|ocean|sea|island|key|shore|marina|port|harbor|boca|miami|malibu|santa monica|san diego|honolulu|cancun|cabo/i.test(name);
  const isMountain = /mountain|alpine|aspen|vail|denver|salt lake|boulder|jackson|tahoe|whistler/i.test(name);
  const isDesert = /phoenix|tucson|vegas|scottsdale|palm springs|sedona|albuquerque|mojave/i.test(name);
  const isTropical = /hawaii|caribbean|bahamas|jamaica|puerto rico|key west|miami|cancun|bali|thailand|fiji/i.test(name);
  const isUrban = /new york|london|tokyo|paris|chicago|los angeles|san francisco|seattle|boston|atlanta|dallas|houston/i.test(name);
  const isRural = /farm|country|village|rural|meadow/i.test(name);

  const condition = getWeatherCondition(weather.weatherCode);
  const isRaining = ['rain', 'drizzle', 'thunderstorm'].includes(condition);
  const isSnowing = condition === 'snow';
  const isCold = weather.temperature < 10;
  const isHot = weather.temperature > 30;

  // Indoor scenes for bad weather
  if (isRaining || isSnowing) {
    const indoorScenes = [
      'cozy living room with large windows showing the weather outside, raindrops on the glass',
      'warm sunroom with panoramic windows overlooking the stormy weather',
      'comfortable window seat with pillows, watching the weather through foggy glass',
      'elegant study with floor-to-ceiling windows, weather visible outside',
    ];
    // Sometimes show outdoor scenes even in rain for variety
    if (Math.random() > 0.4) {
      return indoorScenes[Math.floor(Math.random() * indoorScenes.length)];
    }
  }

  // Coastal locations
  if (isCoastal || isTropical) {
    if (isRaining) {
      return 'wooden dock extending into choppy gray waters, dark storm clouds overhead, palm trees swaying in the wind';
    }
    if (weather.isDay) {
      return 'sunny beach with white sand and turquoise waters, palm trees, beach umbrella nearby';
    }
    return 'moonlit beach with gentle waves, palm trees silhouetted against the night sky';
  }

  // Mountain locations
  if (isMountain) {
    if (isSnowing) {
      return 'cozy ski lodge deck with snow-covered mountains in the background, snowflakes falling';
    }
    if (weather.isDay) {
      return 'scenic mountain overlook with pine trees and distant peaks, crisp mountain air';
    }
    return 'mountain cabin porch under a starry sky, distant peaks visible';
  }

  // Desert locations
  if (isDesert) {
    if (weather.isDay && isHot) {
      return 'shaded desert patio with cacti and succulents, terracotta pots, southwestern style';
    }
    if (!weather.isDay) {
      return 'desert landscape under a brilliant starry sky, saguaro cacti silhouettes';
    }
    return 'adobe courtyard with desert plants, warm earth tones';
  }

  // Urban locations
  if (isUrban) {
    if (isRaining) {
      return 'high-rise apartment window with city lights blurred by rain, cozy interior';
    }
    if (weather.isDay) {
      return 'rooftop garden in the city, urban skyline in the background, potted plants';
    }
    return 'city apartment balcony at night, twinkling city lights below';
  }

  // Rural/default locations
  if (isRural || !weather.isDay) {
    if (isRaining) {
      return 'farmhouse porch with rain falling on the garden, misty countryside';
    }
    return 'peaceful countryside garden with flowers and a wooden fence';
  }

  // Default outdoor scenes by weather
  if (weather.isDay) {
    return 'beautiful backyard garden with flowers and trees, natural sunlight';
  }
  return 'cozy backyard at twilight with string lights and comfortable seating';
}

// Get cat expression and pose based on weather
function getCatExpression(weather: WeatherData): string {
  const condition = getWeatherCondition(weather.weatherCode);
  const temp = weather.temperature;

  const expressions: Record<string, string[]> = {
    clear: [
      'blissfully happy with eyes half-closed, basking in the warmth',
      'contentedly lounging with a peaceful expression',
      'playfully alert with bright curious eyes',
      'regally posed with a satisfied expression',
    ],
    'partly-cloudy': [
      'relaxed and comfortable, watching clouds drift by',
      'peacefully observing the scenery with calm eyes',
      'casually grooming with a content expression',
    ],
    cloudy: [
      'thoughtfully gazing at the sky with a contemplative look',
      'calmly resting with a serene expression',
      'quietly alert, watching for changes in the weather',
    ],
    fog: [
      'mysteriously peering through the mist with curious eyes',
      'cautiously exploring with whiskers forward',
      'dreamily watching the fog swirl with half-closed eyes',
    ],
    drizzle: [
      'slightly annoyed with flattened ears, looking at the drizzle',
      'seeking shelter with a disgruntled expression',
      'watching raindrops with curious but skeptical eyes',
    ],
    rain: [
      'absolutely miserable and drenched, looking utterly pathetic and sad',
      'dramatically unhappy with soaking wet fur, pleading eyes',
      'grumpily huddled trying to stay dry, annoyed expression',
      'forlornly sitting in the rain with the saddest eyes imaginable',
    ],
    snow: [
      'fascinated by snowflakes, trying to catch them with paws',
      'fluffed up against the cold, watching snow fall with wonder',
      'playfully pouncing at snowflakes with excited eyes',
      'curled up tight, slightly shivering but curious about the snow',
    ],
    thunderstorm: [
      'wide-eyed and startled by thunder, fur slightly puffed',
      'hiding partially, peeking out with nervous eyes',
      'alert and tense, ears back, watching lightning flash',
      'seeking comfort, looking for a safe spot with worried expression',
    ],
  };

  // Temperature-based modifiers
  let tempModifier = '';
  if (temp < 0) {
    tempModifier = ', shivering slightly with fur puffed up for warmth';
  } else if (temp < 10) {
    tempModifier = ', seeking warmth with fur fluffed';
  } else if (temp > 35) {
    tempModifier = ', panting slightly with tongue out, seeking shade';
  } else if (temp > 28) {
    tempModifier = ', stretched out lazily to stay cool';
  }

  const expressionList = expressions[condition] || expressions['clear'];
  const randomExpression = expressionList[Math.floor(Math.random() * expressionList.length)];

  return randomExpression + tempModifier;
}

// Get time of day description
function getTimeOfDayDescription(weather: WeatherData): string {
  if (weather.isDay) {
    // Estimate time based on UV index (rough approximation)
    if (weather.uvIndex >= 8) {
      return 'midday with the sun high overhead';
    } else if (weather.uvIndex >= 5) {
      return 'late morning or early afternoon';
    } else if (weather.uvIndex >= 2) {
      return 'golden hour with warm soft light';
    } else {
      return 'early morning or late afternoon with gentle light';
    }
  } else {
    return 'nighttime under the dark sky';
  }
}

// Get weather atmosphere description
function getWeatherAtmosphere(weather: WeatherData): string {
  const condition = getWeatherCondition(weather.weatherCode);
  const visibility = weather.visibility;
  const humidity = weather.humidity;
  const windSpeed = weather.windSpeed;

  let atmosphere = '';

  // Visibility effects
  if (visibility < 2) {
    atmosphere += 'thick fog limiting visibility, mysterious atmosphere, ';
  } else if (visibility < 5) {
    atmosphere += 'hazy air with reduced visibility, ';
  }

  // Wind effects
  if (windSpeed > 40) {
    atmosphere += 'strong winds blowing fur and leaves, dramatic movement, ';
  } else if (windSpeed > 20) {
    atmosphere += 'breezy conditions with gentle movement in the air, ';
  }

  // Humidity effects (for non-rain)
  if (humidity > 85 && !['rain', 'drizzle'].includes(condition)) {
    atmosphere += 'humid and muggy atmosphere, ';
  }

  // Specific weather conditions
  switch (condition) {
    case 'rain':
      atmosphere += 'visible raindrops falling, wet surfaces reflecting light, puddles forming, dark clouds overhead, ';
      break;
    case 'drizzle':
      atmosphere += 'fine mist in the air, everything slightly damp, soft gray light, ';
      break;
    case 'thunderstorm':
      atmosphere += 'dramatic dark clouds, lightning illuminating the scene, heavy rain, ominous atmosphere, ';
      break;
    case 'snow':
      atmosphere += 'snowflakes drifting down, white snow covering surfaces, winter wonderland, ';
      break;
    case 'fog':
      atmosphere += 'ethereal mist swirling, limited visibility, mysterious mood, ';
      break;
    case 'clear':
      if (weather.isDay) {
        atmosphere += 'brilliant sunshine, clear blue sky, crisp shadows, ';
      } else {
        atmosphere += 'stars twinkling, clear night sky, moonlight casting soft shadows, ';
      }
      break;
  }

  return atmosphere;
}

function buildPrompt(context: PromptContext): string {
  const { weather, catName, location } = context;

  const scene = getLocationScene(location, weather);
  const expression = getCatExpression(weather);
  const timeOfDay = getTimeOfDayDescription(weather);
  const atmosphere = getWeatherAtmosphere(weather);
  const temp = weather.temperature;
  const tempUnit = temp > -50 ? `${temp}°C (${Math.round(temp * 9/5 + 32)}°F)` : `${temp}°C`;

  const prompt = `A photorealistic image of a cat named ${catName} in ${location.name}.

Setting: ${scene}.

Time: ${timeOfDay}.

Weather atmosphere: ${atmosphere}temperature feels like ${tempUnit}.

The cat is ${expression}.

Style: High-quality professional pet photography, cinematic lighting matching the weather and time of day, sharp focus on the cat with beautiful bokeh background, realistic textures on fur and environment, emotionally evocative scene that tells a story.`;

  return prompt;
}

// Legacy buildPrompt for backward compatibility
function buildPromptSimple(weather: WeatherData, catName: string): string {
  return buildPrompt({
    weather,
    catName,
    location: { name: 'Unknown Location', latitude: 0, longitude: 0 },
  });
}

// Generate using OpenAI DALL-E API
async function generateWithOpenAI(
  apiKey: string,
  prompt: string,
  catPhotoDataUrl: string
): Promise<GenerationResult> {
  try {
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
        quality: 'hd',
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
  provider: 'openai' | 'stability' = 'openai',
  location?: Location
): Promise<GenerationResult> {
  const prompt = buildPrompt({
    weather,
    catName: catPhoto.name,
    location: location || { name: 'Unknown Location', latitude: 0, longitude: 0 },
  });

  if (provider === 'stability') {
    return generateWithStability(apiKey, prompt, catPhoto.dataUrl);
  }

  return generateWithOpenAI(apiKey, prompt, catPhoto.dataUrl);
}

// Demo mode - returns a placeholder based on weather
export function getDemoImage(weather: WeatherData): string {
  const condition = getWeatherCondition(weather.weatherCode);
  const isDay = weather.isDay;

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

export { buildPrompt, buildPromptSimple };
