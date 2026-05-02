import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WeatherCard from './weatherCard';

const mockData = {
  dt: 1714003200,
  main: { temp: 22, feels_like: 20, humidity: 55 },
  weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
  wind: { speed: 3 }
};

describe('WeatherCard', () => {
  it('показывает температуру', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText('22°C')).toBeDefined();
  });

  it('показывает описание погоды', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText('ясно')).toBeDefined();
  });

  it('показывает скорость ветра', () => {
    render(<WeatherCard data={mockData} />);
    expect(screen.getByText(/3 м\/с/)).toBeDefined();
  });
});