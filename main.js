const API_KEY = `a139e22324488946b4cfba798c50544d`;
const BASE_API_WEATHER = `http://api.openweathermap.org`;
const API_PROVINCES = `https://provinces.open-api.vn/api/?depth=2`;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const dropdownList = $(".dropdown-list");
const dropdownMenu = $(".header-user__dropdown");
const currentSelected = $(".current-selected");
const app = {
  isShowDropdown: false,
  currentCityName: "Ho Chi Minh",
  addressData: [],
  forecastOnWeek: [],
  currentForecast: {},
  coordinate: {
    lat: "",
    lon: "",
  },

  getAllAddress: async function () {
    try {
      const response = await axios.get(`${API_PROVINCES}`);
      if (response.status === 200) {
        this.addressData = response.data;
        this.renderDropdownItem();
      }
    } catch (error) {
      console.error("Error when fetching data:", error);
    }
  },
  getForecastByCityName: async function () {
    try {
      const response = await axios.get(
        `${BASE_API_WEATHER}/data/2.5/weather?q=${this.currentCityName}&appid=${API_KEY}`
      );
      console.log("forecase:", response.data);
      if (response && response?.data.cod === 200) {
        this.currentForecast = response.data;
        console.log("current forecase:", this.currentForecast);
        this.renderCurrentForeCast();
      }
    } catch (error) {
      console.error("Error when fetching data:", error);
    }
  },
  formatNumber: function (number) {
    return number < 10 ? `0${number}` : `${number}`;
  },
  convertTemperature: function (kelvin) {
    return Math.floor(kelvin - 273.15);
  },
  getCurrentDate: function () {
    let currentYearElm = $(".current-year");
    let currentMonthElm = $(".current-month");
    let currentDayElm = $(".current-day");
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[currentMonth];
    currentDayElm.textContent = currentDay;
    currentMonth.textContent = monthName;
    currentYearElm.textContext = currentDate.getFullYear();
  },
  renderCurrentForeCast: function () {
    let sunriseElm = $(".sunrise-value");
    let sunsetElm = $(".sunset-value");
    let windSpeedElm = $(".wind-speed");
    let humidityElm = $(".forecast-humidity");
    let tempFeelsLikeElm = $(".temp__feels-like");
    let temperatureElm = $(".forecase-temperature");
    let pressureElm = $(".forecast-pressure");
    const {
      sys,
      weather,
      wind,
      main: {
        temp,
        feels_like,
        temp_min,
        temp_max,
        pressure,
        humidity,
        sea_level,
      },
      visibility,
      wind: { speed },
    } = this.currentForecast;
    //Temperature
    //convert kelvin to celsius
    const currentTempCelsius = this.convertTemperature(temp);
    temperatureElm.textContent = `${currentTempCelsius}`;
    //sunrise and sunset
    const sunriseDate = new Date(sys?.sunrise * 1000);
    const sunsetDate = new Date(sys?.sunset * 1000);
    const sunriseHours = this.formatNumber(sunriseDate.getHours());
    const sunriseMinutes = this.formatNumber(sunriseDate.getMinutes());
    const sunsetHours = this.formatNumber(sunsetDate?.getHours());
    const sunsetMinutes = this.formatNumber(sunsetDate?.getMinutes());
    sunriseElm.textContent = `${sunriseHours}:${sunriseMinutes} AM`;
    sunsetElm.textContent = `${sunsetHours}:${sunsetMinutes} PM`;
    //feels like
    const feelsLikeCelsius = this.convertTemperature(feels_like);
    tempFeelsLikeElm.textContent = `${feelsLikeCelsius} °C`;
    //wind speed
    const windSpeedKmPerHour = wind.speed * 3.6;
    const windSpeed = windSpeedKmPerHour.toFixed(2);
    windSpeedElm.textContent = `${windSpeed} Km/h`;
    //Pressure
    pressureElm.textContent = `${pressure} MB`;
    //Humidity
    humidityElm.textContent = `${humidity}%`;
  },
  renderDropdownItem: function () {
    let newAddressArrs = this.addressData.map((address) => {
      return {
        code: address.code,
        name: address.name,
        codeName: address.codename,
        phoneCode: address.phone_code,
      };
    });
    let html = newAddressArrs.map((item, index) => {
      return `
          <div data-cityname="${item.name}" class="dropdown-item cursor-pointer px-3 py-2 flex justify-start items-center">${item.name}</div>
          `;
    });
    dropdownList.innerHTML = html.join("");
  },
  getCoordinateByCityName: async function () {
    try {
      const response = await axios.get(
        `${BASE_API_WEATHER}/geo/1.0/direct?q=${this.currentCityName}&appid=${API_KEY}`
      );
      let currentLocation = response?.data[0];
      if (currentLocation && currentLocation?.lon && currentLocation?.lat) {
        this.coordinate.lat = currentLocation.lat;
        this.coordinate.lon = currentLocation.lon;
      }
    } catch (error) {
      console.error("Error when fetching data:", error);
    }
  },
  getForecastOnWeek: async function () {
    try {
      const response = await axios.get(
        `${BASE_API_WEATHER}/data/2.5/forecast?q=${this.currentCityName}&cnt=6&appid==${API_KEY}`
      );
      if (response && response?.list.length > 0) {
        this.forecastOnWeek = response.list;
        console.log(this.forecastOnWeek);
      }
    } catch (error) {
      console.error("Error when fetching data:", error);
    }
  },
  handleEvent: function () {
    const _this = this;
    dropdownList.onclick = async function (event) {
      const cityNode = event.target.closest(".dropdown-item");
      currentCityName = cityNode.textContent;
      currentSelected.textContent = currentCityName;
      console.log("currentCity:", currentCityName);
      await _this.getForecastOnWeek();
    };
    dropdownMenu.onclick = function (event) {
      event.stopPropagation();
      _this.isShowDropdown = !_this.isShowDropdown;
      dropdownList.classList.toggle("show", _this.isShowDropdown);
    };
    document.onclick = function (event) {
      const targetElm = event.target;
      if (!dropdownMenu.contains(targetElm)) {
        dropdownList.classList.remove("show");
      }
    };
  },

  start: function () {
    this.getAllAddress();
    this.getCoordinateByCityName();
    this.getForecastOnWeek();
    this.getForecastByCityName();
    this.getCurrentDate();
    this.handleEvent();
  },
};
app.start();
