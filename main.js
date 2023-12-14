const API_KEY = `a139e22324488946b4cfba798c50544d`;
const BASE_API = `http://api.openweathermap.org`;
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
        `${BASE_API}/data/2.5/weather?q=${this.currentCityName}&appid=${API_KEY}`
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
  renderCurrentForeCast: function () {
    let sunriseElm = $(".sunrise-value");
    let sunsetElm = $(".sunset-value");
    const {
      sys: { sunrise, sunset },
    } = this.currentForecast;
    console.log(sys);
    if (sunrise && sunset) {
      // const sunriseDate = new Date(sunrise * 1000);
      // const sunsetDate = new Date(sunset * 1000);
      // const sunriseHours = this.formatNumber(sunriseDate.getHours());
      // const sunriseMinutes = this.formatNumber(sunriseDate.getMinute());
      // const sunsetHours = this.formatNumber(sunsetDate.getHours());
      // const sunsetMinutes = this.formatNumber(sunsetDate.getMinutes());
      // console.log(sunriseHours);
      // sunriseElm.innerText = `${sunriseHours} : ${sunriseMinutes}`;
      // sunsetElm.innerText = `${sunsetHours} : ${sunsetMinutes}`;
    }
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
          <div class="dropdown-item cursor-pointer px-3 py-2 flex justify-start items-center">${item.name}</div>
          `;
    });
    dropdownList.innerHTML = html.join("");
  },
  getCoordinateByCityName: async function () {
    try {
      const response = await axios.get(
        `${BASE_API}/geo/1.0/direct?q=${this.currentCityName}&appid=${API_KEY}`
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
        `${BASE_API}/data/2.5/forecast?q=${this.currentCityName}&cnt=6&appid==${API_KEY}`
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
      // if (!_this.isShowDropdown) {
      //   _this.isShowDropdown = true;
      //   dropdownList.classList.add("show");
      // } else {
      //   _this.isShowDropdown = false;
      //   dropdownList.classList.remove("show");
      // }
      _this.isShowDropdown = !_this.isShowDropdown;
      dropdownList.classList.toggle("show", _this.isShowDropdown);
    };
  },

  start: function () {
    this.getAllAddress();
    this.getCoordinateByCityName();
    this.getForecastOnWeek();
    this.getForecastByCityName();
    this.handleEvent();
  },
};
app.start();
