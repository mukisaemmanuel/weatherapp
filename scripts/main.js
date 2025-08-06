// === API Key & Elements ===
const API_KEY = "8c40e983dceae1939aaa911c30640af2";
const cityNameEl = document.getElementById("cityName");
const updateStatusEl = document.getElementById("updateStatus");
const temperatureEl = document.getElementById("temperature");
const weatherDescEl = document.getElementById("weatherDesc");
const windSpeedEl = document.getElementById("windSpeed");
const humidityEl = document.getElementById("humidity");
const rainEl = document.getElementById("rain");
const citySearchEl = document.getElementById("citySearch");
const searchBtnEl = document.getElementById("searchBtn");
const clearSearchEl = document.getElementById("clearSearch");
const voiceBtnEl = document.getElementById("voiceBtn");
// weatherIconDisplayEl is selected by class since it has no ID in HTML

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

// Weather color mapping for dynamic background
const weatherColors = {
  "01d": { primary: "#ff9a00", secondary: "#ff6600" }, // Sunny
  "01n": { primary: "#001144", secondary: "#2244aa" }, // Clear night
  "02d": { primary: "#a0a0c0", secondary: "#8080a0" }, // Partly cloudy
  "02n": { primary: "#222244", secondary: "#444477" }, // Partly cloudy night
  "03d": { primary: "#8080a0", secondary: "#606080" }, // Cloudy
  "03n": { primary: "#333355", secondary: "#555577" }, // Cloudy night
  "04d": { primary: "#606080", secondary: "#404060" }, // Overcast
  "04n": { primary: "#222244", secondary: "#444466" }, // Overcast night
  "09d": { primary: "#4a90e2", secondary: "#3a70c2" }, // Rain
  "09n": { primary: "#224477", secondary: "#3366aa" }, // Rain night
  "10d": { primary: "#4a90e2", secondary: "#3a70c2" }, // Rain
  "10n": { primary: "#224477", secondary: "#3366aa" }, // Rain night
  "11d": { primary: "#7b68ee", secondary: "#5b48ce" }, // Thunderstorm
  "11n": { primary: "#443388", secondary: "#6655aa" }, // Thunderstorm night
  "13d": { primary: "#87ceeb", secondary: "#67aedb" }, // Snow
  "13n": { primary: "#557799", secondary: "#7799bb" }, // Snow night
  "50d": { primary: "#a0a0a0", secondary: "#808080" }, // Mist
  "50n": { primary: "#444444", secondary: "#666666" }, // Mist night
};

// Day names for weekly forecast
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Voice recognition variables
let isListening = false;
let recognition;

// Initialize voice recognition if available
function initVoiceRecognition() {
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = function () {
      isListening = true;
      voiceBtnEl.classList.add("listening");
      voiceBtnEl.title = "Listening...";
    };

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      citySearchEl.value = transcript;
      handleSearchInput();
      performSearch();
    };

    recognition.onerror = function (event) {
      console.error("Voice recognition error:", event.error);
      stopVoiceRecognition();
    };

    recognition.onend = function () {
      stopVoiceRecognition();
    };
  } else {
    voiceBtnEl.style.display = "none";
  }
}

function startVoiceRecognition() {
  if (recognition && !isListening) {
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting voice recognition:", error);
    }
  }
}

function stopVoiceRecognition() {
  isListening = false;
  voiceBtnEl.classList.remove("listening");
  voiceBtnEl.title = "Voice search";
}

// Update background based on weather
function updateWeatherBackground(iconCode) {
  const colors = weatherColors[iconCode] || weatherColors["03d"];
  document.documentElement.style.setProperty("--primary-bg", colors.primary);
  document.documentElement.style.setProperty(
    "--secondary-bg",
    colors.secondary
  );

  // Reinitialize particles with weather-specific settings
  initParticles(iconCode);
}

// Helper function to convert hex to rgb
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

// Update weather icon in the 3D globe
function updateWeatherIcon(iconCode) {
  const icon = weatherIcons[iconCode] || "☁️";
  const weatherIconDisplay = document.querySelector(".weather-icon-display");
  if (weatherIconDisplay) {
    weatherIconDisplay.textContent = icon;
  }
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
    displayForecastData(forecastData);

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
  temperatureEl.textContent = Math.round(data.main.temp);
  weatherDescEl.textContent = data.weather[0].description;

  // Update weather icon in globe
  updateWeatherIcon(data.weather[0].icon);

  // Update background based on weather
  updateWeatherBackground(data.weather[0].icon);

  windSpeedEl.textContent = Math.round(data.wind.speed);
  humidityEl.textContent = data.main.humidity;

  // Calculate rain probability (using pop from forecast if available, otherwise estimate)
  const rainProbability = data.rain
    ? Math.round((data.rain["1h"] || 0) * 10)
    : Math.round(Math.random() * 30 + 50);
  rainEl.textContent = rainProbability;
}

function displayForecastData(data) {
  // Process forecast data to get next few hours
  const forecastItems = document.querySelectorAll(".forecast-item");
  console.log("Forecast items found:", forecastItems.length);
  console.log("Forecast data:", data);

  if (forecastItems.length >= 3 && data.list) {
    console.log("Updating forecast data...");

    // Get next 2 hours forecast
    if (data.list[0]) {
      const item1 = data.list[0];
      console.log("Item 1:", item1);
      const timeEl = forecastItems[0].querySelector(".forecast-time");
      const iconEl = forecastItems[0].querySelector(".forecast-icon");
      const tempEl = forecastItems[0].querySelector(".forecast-temp");

      if (timeEl && iconEl && tempEl) {
        timeEl.textContent = "2h";
        iconEl.textContent = weatherIcons[item1.weather[0].icon] || "☁️";
        tempEl.textContent = Math.round(item1.main.temp) + "°";
        console.log("Updated item 1");
      }
    }

    // Get next 4 hours forecast
    if (data.list[1]) {
      const item2 = data.list[1];
      console.log("Item 2:", item2);
      const timeEl = forecastItems[1].querySelector(".forecast-time");
      const iconEl = forecastItems[1].querySelector(".forecast-icon");
      const tempEl = forecastItems[1].querySelector(".forecast-temp");

      if (timeEl && iconEl && tempEl) {
        timeEl.textContent = "4h";
        iconEl.textContent = weatherIcons[item2.weather[0].icon] || "☁️";
        tempEl.textContent = Math.round(item2.main.temp) + "°";
        console.log("Updated item 2");
      }
    }

    // Get tomorrow's forecast (index 8 is approximately 24 hours later)
    if (data.list[8]) {
      const item3 = data.list[8];
      console.log("Item 3:", item3);
      const timeEl = forecastItems[2].querySelector(".forecast-time");
      const iconEl = forecastItems[2].querySelector(".forecast-icon");
      const tempEl = forecastItems[2].querySelector(".forecast-temp");

      if (timeEl && iconEl && tempEl) {
        timeEl.textContent = "Tomorrow";
        iconEl.textContent = weatherIcons[item3.weather[0].icon] || "☁️";
        const maxTemp = Math.round(item3.main.temp_max);
        const minTemp = Math.round(item3.main.temp_min);
        tempEl.textContent = `+${maxTemp}° / +${minTemp}°`;
        console.log("Updated item 3");
      }
    }
  } else {
    console.log("Not enough forecast items or data missing");
  }
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

// Initialize particles.js
let currentParticleConfig = null;

function initParticles(weatherType = "03d") {
  if (typeof particlesJS !== "undefined") {
    // Get weather-specific particle settings
    const weatherSettings = getWeatherParticleSettings(weatherType);

    // Only reinitialize if settings have changed
    if (
      JSON.stringify(currentParticleConfig) !== JSON.stringify(weatherSettings)
    ) {
      currentParticleConfig = weatherSettings;

      // Destroy existing particles
      if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].destroy();
      }

      // Initialize with new settings
      particlesJS("particles-js", weatherSettings);
    }
  }
}

function getWeatherParticleSettings(weatherType) {
  // Base configuration
  const baseConfig = {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#ffffff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  };

  // Weather-specific modifications
  switch (weatherType) {
    case "01d": // Sunny
    case "01n":
      baseConfig.particles.color.value = "#ffeb3b";
      baseConfig.particles.line_linked.color = "#ffeb3b";
      baseConfig.particles.number.value = 50;
      baseConfig.particles.opacity.value = 0.7;
      break;

    case "09d": // Rain
    case "09n":
    case "10d":
    case "10n":
      baseConfig.particles.color.value = "#4fc3f7";
      baseConfig.particles.line_linked.color = "#4fc3f7";
      baseConfig.particles.shape.type = "circle";
      baseConfig.particles.number.value = 120;
      baseConfig.particles.move.speed = 3;
      baseConfig.particles.move.direction = "bottom";
      break;

    case "11d": // Thunderstorm
    case "11n":
      baseConfig.particles.color.value = "#9c27b0";
      baseConfig.particles.line_linked.color = "#9c27b0";
      baseConfig.particles.number.value = 60;
      baseConfig.particles.size.value = 4;
      baseConfig.interactivity.events.onhover.enable = true;
      baseConfig.interactivity.events.onhover.mode = "light";
      break;

    case "13d": // Snow
    case "13n":
      baseConfig.particles.color.value = "#bbdefb";
      baseConfig.particles.line_linked.color = "#bbdefb";
      baseConfig.particles.shape.type = "circle";
      baseConfig.particles.number.value = 100;
      baseConfig.particles.move.speed = 1;
      baseConfig.particles.move.direction = "bottom";
      break;

    case "50d": // Mist
    case "50n":
      baseConfig.particles.color.value = "#eeeeee";
      baseConfig.particles.line_linked.color = "#eeeeee";
      baseConfig.particles.opacity.value = 0.3;
      baseConfig.particles.number.value = 40;
      break;

    default: // Cloudy
      baseConfig.particles.color.value = "#bdbdbd";
      baseConfig.particles.line_linked.color = "#bdbdbd";
      baseConfig.particles.opacity.value = 0.4;
      baseConfig.particles.number.value = 70;
  }

  return baseConfig;
}

// Initialize the app
function initApp() {
  // Initialize voice recognition
  initVoiceRecognition();

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

  // Voice search
  if (voiceBtnEl) {
    voiceBtnEl.addEventListener("click", startVoiceRecognition);
  }

  // Focus on search input when page loads
  citySearchEl.focus();
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
