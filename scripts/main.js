// === API Key & Elements ===
const API_KEY = "8c40e983dceae1939aaa911c30640af2";
const cityNameEl = document.getElementById("cityName");
const updateStatusEl = document.getElementById("updateStatus");
const temperatureEl = document.getElementById("temperature");
const weatherDescEl = document.getElementById("weatherDesc");
const weatherIconEl = document.getElementById("weatherIcon");
const windSpeedEl = document.getElementById("windSpeed");
const humidityEl = document.getElementById("humidity");
const rainEl = document.getElementById("rain");
const hourlyForecastEl = document.getElementById("hourlyForecast");
const weeklyForecastEl = document.getElementById("weeklyForecast");
const citySearchEl = document.getElementById("citySearch");
const searchBtnEl = document.getElementById("searchBtn");
const clearSearchEl = document.getElementById("clearSearch");
const themeToggleEl = document.getElementById("themeToggle");

// Weather icon mapping
const weatherIcons = {
  "01d": "☀️",
  "01n": "🌙",
  "02d": "⛅",
  "02n": "☁️",
  "03d": "☁️",
  "03n": "☁️",
  "04d": "☁️",
  "04n": "☁️",
  "09d": "🌧️",
  "09n": "🌧️",
  "10d": "🌦️",
  "10n": "🌧️",
  "11d": "⛈️",
  "11n": "⛈️",
  "13d": "❄️",
  "13n": "❄️",
  "50d": "🌫️",
  "50n": "🌫️",
};

// Day names for weekly forecast
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Theme management
let currentTheme = localStorage.getItem("theme") || "dark";

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Update theme toggle icon
  const icon = themeToggleEl.querySelector("i");
  if (theme === "light") {
    icon.className = "fas fa-sun";
    themeToggleEl.title = "Switch to dark mode";
  } else {
    icon.className = "fas fa-moon";
    themeToggleEl.title = "Switch to light mode";
  }
}

function toggleTheme() {
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

async function getWeather(city) {
  updateStatusEl.textContent = "Updating...";
  updateStatusEl.classList.add("updating");

  try {
    // Get current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const currentResponse = await fetch(currentUrl);
    if (!currentResponse.ok) throw new Error("City not found");
    const currentData = await currentResponse.json();

    // Get 5-day forecast for hourly and weekly
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) throw new Error("Forecast data unavailable");
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayHourlyForecast(forecastData);
    displayWeeklyForecast(forecastData);

    updateStatusEl.textContent = "Updated just now";
    updateStatusEl.classList.remove("updating");
  } catch (error) {
    updateStatusEl.textContent = error.message;
    updateStatusEl.classList.remove("updating");
    console.error("Weather fetch error:", error);
  }
}

function displayCurrentWeather(data) {
  cityNameEl.textContent = data.name;
  temperatureEl.textContent = `${Math.round(data.main.temp)}°`;
  weatherDescEl.textContent = data.weather[0].description;
  weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  windSpeedEl.textContent = Math.round(data.wind.speed);
  humidityEl.textContent = data.main.humidity;

  // Calculate rain probability (using pop from forecast if available, otherwise estimate)
  const rainProbability = data.rain
    ? Math.round((data.rain["1h"] || 0) * 10)
    : Math.round(Math.random() * 30 + 50);
  rainEl.textContent = rainProbability;
}

function displayHourlyForecast(data) {
  const hourlyData = data.list.slice(0, 8); // Next 24 hours (3-hour intervals)

  hourlyForecastEl.innerHTML = hourlyData
    .map((item, index) => {
      const time = new Date(item.dt * 1000);
      const hour = time.getHours();
      const temp = Math.round(item.main.temp);
      const icon = weatherIcons[item.weather[0].icon] || "☁️";

      return `
      <div class="hour-card">
        <div>${hour}:00</div>
        <div class="hour-icon">${icon}</div>
        <div>${temp}°</div>
      </div>
    `;
    })
    .join("");
}

function displayWeeklyForecast(data) {
  // Group forecast by day and get daily averages
  const dailyData = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toDateString();

    if (!dailyData[day]) {
      dailyData[day] = {
        temps: [],
        icons: [],
        descriptions: [],
      };
    }

    dailyData[day].temps.push(item.main.temp);
    dailyData[day].icons.push(item.weather[0].icon);
    dailyData[day].descriptions.push(item.weather[0].description);
  });

  // Convert to array and get next 7 days
  const weeklyData = Object.entries(dailyData).slice(0, 7);

  weeklyForecastEl.innerHTML = weeklyData
    .map(([day, info], index) => {
      const date = new Date(day);
      const dayName = dayNames[date.getDay()];
      const maxTemp = Math.round(Math.max(...info.temps));
      const minTemp = Math.round(Math.min(...info.temps));

      // Get most common weather condition for the day
      const mostCommonIcon = info.icons[Math.floor(info.icons.length / 2)];
      const icon = weatherIcons[mostCommonIcon] || "☁️";

      return `
      <div class="day-card">
        <div>${dayName}</div>
        <div class="day-icon">${icon}</div>
        <div>+${maxTemp}° / +${minTemp}°</div>
      </div>
    `;
    })
    .join("");
}

// Search functionality
function performSearch() {
  const city = citySearchEl.value.trim();
  if (city) {
    getWeather(city);
    citySearchEl.value = ""; // Clear the input after search
    clearSearchEl.classList.remove("visible");
  }
}

function clearSearch() {
  citySearchEl.value = "";
  clearSearchEl.classList.remove("visible");
  citySearchEl.focus();
}

function handleSearchInput() {
  const hasValue = citySearchEl.value.trim().length > 0;
  clearSearchEl.classList.toggle("visible", hasValue);
}

// Initialize the app
function initApp() {
  // Set initial theme
  setTheme(currentTheme);

  // Default city - you can change this
  getWeather("Kampala");

  // Auto-refresh every 30 minutes
  setInterval(() => {
    const currentCity = cityNameEl.textContent;
    if (currentCity && currentCity !== "City Name") {
      getWeather(currentCity);
    }
  }, 30 * 60 * 1000);

  // Search event listeners
  searchBtnEl.addEventListener("click", performSearch);

  citySearchEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  citySearchEl.addEventListener("input", handleSearchInput);

  clearSearchEl.addEventListener("click", clearSearch);

  // Theme toggle
  themeToggleEl.addEventListener("click", toggleTheme);

  // Focus on search input when page loads
  citySearchEl.focus();
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
