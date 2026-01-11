import { Component } from 'solid-js';

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const WeatherIcon: Component<WeatherIconProps> = (props) => {
  const size = () => {
    switch (props.size) {
      case 'sm':
        return 24;
      case 'lg':
        return 48;
      default:
        return 32;
    }
  };

  const getIcon = () => {
    const code = props.code;
    const isDay = props.isDay ?? true;

    // Clear
    if (code === 0) {
      return isDay ? '☀️' : '🌙';
    }
    // Mainly clear
    if (code === 1) {
      return isDay ? '🌤️' : '🌙';
    }
    // Partly cloudy
    if (code === 2) {
      return isDay ? '⛅' : '☁️';
    }
    // Overcast
    if (code === 3) {
      return '☁️';
    }
    // Fog
    if (code >= 45 && code <= 48) {
      return '🌫️';
    }
    // Drizzle
    if (code >= 51 && code <= 57) {
      return '🌧️';
    }
    // Rain
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
      return '🌧️';
    }
    // Snow
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return '❄️';
    }
    // Thunderstorm
    if (code >= 95) {
      return '⛈️';
    }

    return '🌡️';
  };

  return (
    <span
      style={{
        'font-size': `${size()}px`,
        'line-height': '1',
        display: 'inline-block',
      }}
      role="img"
      aria-label="weather icon"
    >
      {getIcon()}
    </span>
  );
};

export default WeatherIcon;
