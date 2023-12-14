import axios from "axios";
const API_KEY = `a139e22324488946b4cfba798c50544d`;
export const getAllAddress = async () => {
  const response = await axios.get(
    `https://provinces.open-api.vn/api/?depth=2`
  );
  return response.data;
};
export const getWeatherByCityName = async (cityName) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
  );
  return response.data;
};

export const getCoordinateByCityName = async () => {
  const response = await axios.get(
    `http://api.openweathermap.org/geo/1.0/direct?q=London&appid=${API_KEY}`
  );
  return response.data;
};
