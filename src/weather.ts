export interface WeatherData {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface ForecastResponse {
  list: WeatherData[];
  city: {
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
}