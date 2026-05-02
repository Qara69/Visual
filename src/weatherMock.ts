import { ForecastResponse } from './weather';

export const mockWeatherData: ForecastResponse = {
  city: { 
    name: 'Москва',
    coord: { lat: 55.75, lon: 37.62 }
  },
  list: [
    {
      dt: Date.now() / 1000,
      main: { temp: 20, feels_like: 18, humidity: 65 },
      weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
      wind: { speed: 3 }
    },
    {
      dt: Date.now() / 1000 + 86400,
      main: { temp: 18, feels_like: 16, humidity: 70 },
      weather: [{ id: 801, main: 'Clouds', description: 'облачно', icon: '02d' }],
      wind: { speed: 4 }
    },
    {
      dt: Date.now() / 1000 + 172800,
      main: { temp: 15, feels_like: 14, humidity: 80 },
      weather: [{ id: 500, main: 'Rain', description: 'дождь', icon: '10d' }],
      wind: { speed: 5 }
    },
    {
      dt: Date.now() / 1000 + 259200,
      main: { temp: 22, feels_like: 20, humidity: 60 },
      weather: [{ id: 800, main: 'Clear', description: 'ясно', icon: '01d' }],
      wind: { speed: 2 }
    },
    {
      dt: Date.now() / 1000 + 345600,
      main: { temp: 19, feels_like: 17, humidity: 75 },
      weather: [{ id: 802, main: 'Clouds', description: 'облачно', icon: '03d' }],
      wind: { speed: 3 }
    }
  ]
};