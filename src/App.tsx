import React, { useEffect, useState } from 'react';
import WeatherCard from './weatherCard';
import { mockWeatherData } from './weatherMock';
import { ForecastResponse } from './weather';

const API_KEY = '1715f0479b2eb150baaa43750afe15e2';

const App: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [air, setAir] = useState('');
  const [search, setSearch] = useState('Moscow');
  const [input, setInput] = useState('');

  const loadWeather = async (city: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error();
      
      const data = await res.json();
      const days = data.list.filter((_: any, i: number) => i % 8 === 0).slice(0, 5);
      setForecast({ city: data.city, list: days });

      const { lat, lon } = data.city.coord;
      const airRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const airData = await airRes.json();
      const aqi = airData.list[0]?.main?.aqi;
      const levels = ['', 'Хороший', 'Средний', 'Плохой', 'Очень плохой', 'Опасный'];
      setAir(levels[aqi] || 'Нет данных');
    } catch {
      setForecast(mockWeatherData);
      setAir('Нет данных');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWeather(search);
    const timer = setInterval(() => loadWeather(search), 3 * 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [search]);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setSearch(input.trim());
      setInput('');
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(#4facfe, #00f2fe)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 18
      }}>
        Загрузка...
      </div>
    );
  }

  if (!forecast) return null;

const today = forecast.list[0];
const temp = Math.round(today?.main?.temp || 0);
const desc = today?.weather?.[0]?.description || '';
const icon = today?.weather?.[0]?.icon || '01d';
const restDays = forecast.list.slice(1);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20
    }}>
      
      {/* квадрат */}
      <div style={{
        background: 'linear-gradient( #4facfe, #97ecef)',
        borderRadius: 20,
        padding: 30,
        width: 700,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        textAlign: 'center'
      }}>
        
        {/* Поиск */}
        <form onSubmit={go} style={{ marginBottom: 16 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Город..."
            style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid #ccc', marginRight: 8 }}
          />
          <button type="submit" style={{ padding: '6px 12px', borderRadius: 20, background: '#a5ccee', color: '#fff', border: 'none', cursor: 'pointer' }}>
            🔍
          </button>
        </form>

        {/* Город */}
        <h2 style={{ margin: '0 0 4px', fontSize: 24 }}>{forecast.city.name}</h2>
        
        {/* Воздух */}
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#292929' }}>Воздух: {air}</p>

        {/* Иконка  */}
        <img 
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`} 
          alt="weather" 
          width={80} 
          height={80} 
        />
        <div style={{ fontSize: 48, fontWeight: 'bold', margin: '0 0 4px' }}>{temp}°</div>
        <p style={{ margin: '0 0 4px', fontSize: 16, color: '#093b6e' }}>{desc}</p>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#505050' }}>
          💨 {today?.wind?.speed || 0} м/с | 💧 {today?.main?.humidity || 0}%
        </p>

        {/* Черта */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
          {restDays.map((item, i) => (
            <WeatherCard key={i} data={item} />
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default App;