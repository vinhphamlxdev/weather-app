const API_KEY = `60836d7502891317b3d0942b4f1d416b`;
const BASE_API_WEATHER = `http://api.openweathermap.org`;
const API_PROVINCES = `https://provinces.open-api.vn/api/?depth=2`;
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const dropdownList = $(".dropdown-list");
const dropdownMenu = $(".header-user__dropdown");
const currentSelected = $(".current-selected");
const cloudStatus = $(".cloud-status");
const loadingElm = $(".loading");
const app = {
  isShowDropdown: false,
  isLoading: false,
  currentCityName: "Ho Chi Minh",

  getAllAddress: async function () {
    try {
      const response = await axios.get(`${API_PROVINCES}`);
      if (response.status === 200) {
        this.addressData = response.data;
        this.renderDropdownItem(response.data);
      }
    } catch (error) {
      console.error("Error when fetching data:", error);
    }
  },
  getCoordinateByCityName: async function () {
    try {
      const response = await axios.get(
        `${BASE_API_WEATHER}/geo/1.0/direct?q=${this.currentCityName},VN&appid=${API_KEY}`
      );
      return response;
    } catch (error) {
      console.log("err when fetching data:", error);
    }
  },
  // getForecastByCityName: async function () {
  //   try {
  //     this.isLoading = true;
  //     loadingElm.classList.add("show");
  //     const response = await axios.get(
  //       `${BASE_API_WEATHER}/data/2.5/weather?q=${this.currentCityName}&appid=${API_KEY}`
  //     );

  //     if (response && response?.data.cod === 200) {
  //       this.renderCurrentForeCast(response.data);
  //       this.isLoading = false;
  //       loadingElm.classList.remove("show");
  //     }
  //   } catch (error) {
  //     if (error && error?.response?.data) {
  //     }
  //     console.error("Error when fetching data:", error.response.data);
  //     new Noty({
  //       text: `${error.response.data.message}`,
  //       timeout: 2000,
  //       layout: "topRight",
  //     }).show();
  //   } finally {
  //     this.isLoading = false;
  //     loadingElm.classList.remove("show");
  //   }
  // },
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
  getStatusWeather: function (iconCode) {
    switch (iconCode) {
      case "01d":
        return {
          icon: "./assets/clear-day.png",
          desc: "Clear sky during the day. Bright sunlight illuminates the surroundings.",
        };
      case "01n":
        return {
          icon: "./assets/clear-night.png",
          desc: "Clear sky at night. Twinkling stars and possibly a moonlit night.",
        };
      case "02d":
      case "02n":
      case "03d":
      case "03n":
      case "04d":
      case "04n":
        return {
          icon: "./assets/clouds.png",
          desc: "Partly to mostly cloudy sky. Varying degrees of cloud cover.",
        };
      case "09d":
      case "09n":
      case "10d":
      case "10n":
        return {
          icon: "./assets/rain.png",
          desc: "Rainy weather. Expect rainfall, ranging from light to heavy.",
        };
      case "11d":
      case "11n":
        return {
          icon: "./assets/thunderstorm.png",
          desc: "Thunderstorm. Stormy weather with thunder and lightning.",
        };
      case "13d":
      case "13n":
        return {
          icon: "./assets/snow.png",
          desc: "Snowfall. Delicate snowflakes covering the landscape.",
        };
      case "50d":
      case "50n":
        return {
          icon: "./assets/mist.png",
          desc: "Misty conditions. Reduced visibility with a damp atmosphere.",
        };
      default:
        return {
          icon: "./assets/clear-day.png",
          desc: "Clear sky during the day. Bright sunlight illuminates the surroundings.",
        };
    }
  },
  renderCurrentForeCast: function (data) {
    let sunriseElm = $(".sunrise-value");
    let sunsetElm = $(".sunset-value");
    let windSpeedElm = $(".wind-speed");
    let humidityElm = $(".forecast-humidity");
    let tempFeelsLikeElm = $(".temp__feels-like");
    let temperatureElm = $(".forecase-temperature");
    let pressureElm = $(".forecast-pressure");
    let weatherIconStatusElm = $(".weather-status");
    let mainStatusElm = $(".main-status");
    let weatherShortDescElm = $(".weather__short-description");
    let weatherLongDescElm = $(".weather__long-description");
    let realFellIconElm = $(".real-feel-img");
    const {
      dt,
      sunrise,
      sunset,
      temp,
      feels_like,
      pressure,
      humidity,
      wind_speed,
      weather,
    } = data;
    const { icon, main: mainStatus, description } = weather[0];
    const statusData = this.getStatusWeather(icon);
    weatherIconStatusElm.src = statusData.icon;
    //long description
    weatherLongDescElm.textContent = statusData.desc;
    //main status
    mainStatusElm.textContent = mainStatus;
    //description
    weatherShortDescElm.textContent = description;
    //Temperature
    //convert kelvin to celsius
    const currentTempCelsius = Math.floor(temp);
    temperatureElm.textContent = `${currentTempCelsius}`;
    //sunrise and sunset
    const sunriseDate = new Date(sunrise * 1000);
    const sunsetDate = new Date(sunset * 1000);
    const sunriseHours = this.formatNumber(sunriseDate.getHours());
    const sunriseMinutes = this.formatNumber(sunriseDate.getMinutes());
    const sunsetHours = this.formatNumber(sunsetDate?.getHours());
    const sunsetMinutes = this.formatNumber(sunsetDate?.getMinutes());
    sunriseElm.textContent = `${sunriseHours}:${sunriseMinutes} AM`;
    sunsetElm.textContent = `${sunsetHours}:${sunsetMinutes} PM`;
    //feels like
    const feelsLikeCelsius = Math.floor(feels_like);
    tempFeelsLikeElm.textContent = `${feelsLikeCelsius} °C`;
    if (feelsLikeCelsius >= 28) {
      realFellIconElm.src = "./assets/hot.png";
    } else {
      realFellIconElm.src = "./assets/cold.png";
    }
    //wind speed
    const windSpeedKmPerHour = wind_speed * 3.6;
    const windSpeed = windSpeedKmPerHour.toFixed(2);
    windSpeedElm.textContent = `${windSpeed} Km/h`;
    //Pressure
    pressureElm.textContent = `${pressure} MB`;
    //Humidity
    humidityElm.textContent = `${humidity}%`;
  },

  renderDropdownItem: function (addressData = []) {
    let newAddressArrs = addressData.map((address) => {
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

  getForecastOnWeek: async function (lat = 10.7758439, lon = 106.7017555) {
    try {
      const response = await axios.get(
        `${BASE_API_WEATHER}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&&units=metric&appid=${API_KEY}`
      );
      if (response && response?.data) {
        console.log("forcase on week", response.data);
        console.log("forecastCurrent:", response?.data?.current);
        this.renderCurrentForeCast(response?.data?.current);
        this.renderForcastOnWeek(response?.data?.daily);
      }
    } catch (error) {
      console.error("Error when fetching data:", error);
    }
  },

  updateWeatherForecast: async function () {
    try {
      this.isLoading = true;
      loadingElm.classList.add("show");
      const coordinateRes = await this.getCoordinateByCityName();
      if (
        coordinateRes &&
        coordinateRes.data &&
        coordinateRes.data.length > 0
      ) {
        this.isLoading = false;
        loadingElm.classList.remove("show");
        const { lat, lon } = coordinateRes.data[0];
        console.log("coordinateRes", coordinateRes);
        await this.getForecastOnWeek(lat, lon);
      }
    } catch (error) {
      console.error("err when fetching data:", error);
    } finally {
      this.isLoading = false;
      loadingElm.classList.remove("show");
    }
  },

  handleEvent: function () {
    let darkModeElm = $(".darkmode__btn");
    let darkModeBtnElm = $(".darkmode");
    const _this = this;
    dropdownList.onclick = async function (event) {
      const cityNode = event.target.closest(".dropdown-item");
      currentSelected.textContent = cityNode.textContent;
      let newCityName = cityNode.textContent
        .replace(/(Thành phố|Tỉnh) /g, "")
        .trim();
      _this.currentCityName = newCityName;
      await _this.updateWeatherForecast();
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
    darkModeElm.onclick = function (event) {
      darkModeBtnElm.classList.toggle("active");
      document.body.classList.toggle("dark-theme");
    };
  },

  renderForcastOnWeek: (data = []) => {
    let forecastListElm = $(".forecast-onweek__list");
    console.log("forecast list:", data);
    let html = data
      .filter((el, index) => index > 0 && index < 7)
      .map((item, index) => {
        const {
          dt,
          sunrise,
          sunset,
          temp: { min: tempMin, max: tempMax, day: tempDay },
          feels_like: { day: feelLikeDay },
          pressure,
          humidity,
          wind_speed,
          weather,
        } = item;
        const weatherData = weather[0];
        const { main: mainStatus, description, icon } = weatherData;
        const minTempVal = Math.floor(tempMin);
        const maxTempVal = Math.floor(tempMax);
        const tempAvg = Math.floor((tempMax + tempMin) / 2);
        const statusData = app.getStatusWeather(icon);
        const dayname = new Date(dt * 1000).toLocaleDateString("en", {
          weekday: "long",
        });
        return `
      <div class="card-forecast__item flex justify-between  p-3 rounded-md">
      <div class="flex justify-center flex-col">
        <span class="text-base whitespace-nowrap font-medium day-time">${dayname}</span>
        <span class="text-sm whitespace-nowrap font-normal">${description}</span>
        <div class="text-sm whitespace-nowrap gap-x-2 font-normal flex items-center">
          <span>Min:</span>
          <div class="relative flex gap-x-2">
            <span>${minTempVal}</span>
            <span>C</span>
            <span class="absolute top-[-1px] right-[11px] text-xs">o</span>
          </div>
        </div>
        <div class="text-sm whitespace-nowrap gap-x-2 font-normal flex items-center">
          <span>Max:</span>
          <div class="relative flex gap-x-2">
            <span>${maxTempVal}</span>
            <span>C</span>
            <span class="absolute top-[-1px] right-[11px] text-xs">o</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-y-2 flex-col">
          <div class="relative">
            <img class="cloud-image w-10" src="${statusData?.icon}" alt="">
          </div>
        <div class="relative">
          <span class="text-2xl font-medium">${tempAvg}</span>
          <span class="absolute top-0 text-xs -top-[7px]">o</span>
        </div>
      </div>
    </div>
          `;
      });
    forecastListElm.innerHTML = html.join("");
  },
  handleEvent: function () {
    let darkModeElm = $(".darkmode__btn");
    let darkModeBtnElm = $(".darkmode");
    const _this = this;
    dropdownList.onclick = async function (event) {
      const cityNode = event.target.closest(".dropdown-item");
      currentSelected.textContent = cityNode.textContent;
      let newCityName = cityNode.textContent
        .replace(/(Thành phố|Tỉnh) /g, "")
        .trim();
      _this.currentCityName = newCityName;
      await _this.updateWeatherForecast();
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
    darkModeElm.onclick = function (event) {
      darkModeBtnElm.classList.toggle("active");
      document.body.classList.toggle("dark-theme");
    };
  },

  start: function () {
    this.getAllAddress();
    this.getCurrentDate();
    this.handleEvent();
    this.updateWeatherForecast();
  },
};
app.start();
