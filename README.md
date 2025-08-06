# 🌤️ Weather App

A beautiful, modern weather application with real-time weather data, stunning gradients, and smooth animations. Built with HTML, CSS, and JavaScript.

![Weather App](https://img.shields.io/badge/Weather-App-blue?style=for-the-badge&logo=weather)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🌟 Visual Design

- **Dark & Light Mode** - Toggle between beautiful themes
- **Linear Gradients** - Stunning gradient backgrounds and effects
- **Smooth Animations** - Engaging animations and transitions
- **Responsive Design** - Works perfectly on all devices
- **Modern UI** - Clean, professional interface

### 🌤️ Weather Data

- **Real-time Weather** - Current conditions from OpenWeatherMap API
- **Hourly Forecast** - 24-hour weather predictions
- **7-Day Forecast** - Weekly weather outlook
- **Weather Stats** - Wind speed, humidity, and rain probability
- **Auto-refresh** - Updates every 30 minutes

### 🔍 Search & Navigation

- **City Search** - Search for any city worldwide
- **Quick Search** - Enter key or button click
- **Clear Function** - Easy input clearing
- **Persistent Theme** - Remembers your theme preference

## 🚀 Live Demo

[View Live Demo](https://mukisaemmanuel.github.io/weatherapp/)

## 📱 Screenshots

### Dark Mode

![Dark Mode](screenshots/dark-mode.png)

### Light Mode

![Light Mode](screenshots/light-mode.png)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mukisaemmanuel/weatherapp.git
   cd weatherapp
   ```

2. **Open in browser**

   ```bash
   # Simply open index.html in your browser
   # Or use a local server
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **API Key (Optional)**
   - The app comes with a demo API key
   - For production use, get your own key from [OpenWeatherMap](https://openweathermap.org/api)
   - Replace the API key in `scripts/main.js`

## 🎨 Customization

### Colors & Themes

The app uses CSS custom properties for easy theming:

```css
:root {
  --bg-color: #121212;
  --card-color: #1e1e1e;
  --accent-color: #4da6ff;
  /* ... more variables */
}
```

### Animations

All animations are CSS-based and can be customized in `styles/style.css`:

```css
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

## 📁 Project Structure

```
weatherapp/
├── index.html          # Main HTML file
├── styles/
│   └── style.css       # All styles and animations
├── scripts/
│   └── main.js         # JavaScript functionality
├── README.md           # This file
└── screenshots/        # App screenshots
```

## 🔧 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Styling, gradients, and animations
- **JavaScript (ES6+)** - Dynamic functionality
- **OpenWeatherMap API** - Weather data
- **Font Awesome** - Icons

## 🌟 Key Features Explained

### Gradient Backgrounds

The app uses beautiful linear gradients that shift over time:

```css
--bg-gradient: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
```

### Smooth Animations

Staggered animations create a delightful user experience:

```css
animation: slideInUp 0.8s ease-out 0.2s both;
```

### Theme Toggle

Persistent theme switching with localStorage:

```javascript
function setTheme(theme) {
  localStorage.setItem("theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Mukisa Emmanuel**

- GitHub: [@mukisaemmanuel](https://github.com/mukisaemmanuel)
- Project: [Weather App](https://github.com/mukisaemmanuel/weatherapp)

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Font Awesome](https://fontawesome.com/) for beautiful icons
- CSS gradients and animations inspiration from modern web design

---

⭐ **Star this repository if you found it helpful!**
