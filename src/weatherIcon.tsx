import React from 'react';

interface WeatherIconProps {
  icon: string;
  size?: number;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, size = 80 }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  
  return <img src={iconUrl} alt="weather icon" width={size} height={size} />;
};

export default WeatherIcon;