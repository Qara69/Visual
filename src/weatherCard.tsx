import React from 'react';
import WeatherIcon from './weatherIcon';
import { WeatherData } from './weather';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const date = new Date(data.dt * 1000);
  const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' });
  const dayMonth = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  
  const weather = data.weather[0];
  const temp = Math.round(data.main.temp);
  
  // Цвет фона погоды других дней
  const getBgColor = () => {
    const mainWeather = weather?.main || '';
    if (mainWeather.includes('Clear')) return '#fdf0026d';
    if (mainWeather.includes('Clouds')) return '#9896968d';
    if (mainWeather.includes('Rain')) return '#6da3ebbc';
    if (mainWeather.includes('Snow')) return '#dce0e4b1';
    return '#F5F5F5';
  };

  return (
    <div style={{
      backgroundColor: getBgColor(),
      padding: '16px',
      borderRadius: '12px',
      textAlign: 'center',
      minWidth: '140px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        {dayName}, {dayMonth}
      </div>
      {weather && <WeatherIcon icon={weather.icon} />}
      <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '8px 0' }}>
        {temp}°C
      </div>
      <div style={{ color: '#494949', textTransform: 'capitalize' }}>
        {weather?.description || 'Нет данных'}
      </div>
      <div style={{ fontSize: '12px', color: '#585858', marginTop: '8px' }}>
        💨 {data.wind?.speed || 0} м/с | 💧 {data.main?.humidity || 0}%
      </div>
    </div>
  );
};

export default WeatherCard;