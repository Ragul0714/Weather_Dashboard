// IMPORTANT: Replace 'YOUR_API_KEY' with your actual API key from WeatherAPI.com
const API_KEY = '9185e0a85a04493faaa63316250407'; // Ensure this is your actual API key
const BASE_URL = 'https://api.weatherapi.com/v1';

// Get DOM elements
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const weatherContent = document.getElementById('weatherContent');
const starsContainer = document.getElementById('stars');
const sunPosition = document.getElementById('sunPosition');

// Create stars background
function createStars() {
    const starsCount = 150;
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.opacity = Math.random() * 0.8 + 0.2;
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        starsContainer.appendChild(star);
    }
}

// Current Weather Elements
const currentCityName = document.getElementById('currentCityName');
const currentDateTime = document.getElementById('currentDateTime');
const currentWeatherIcon = document.getElementById('currentWeatherIcon');
const currentTemp = document.getElementById('currentTemp');
const currentCondition = document.getElementById('currentCondition');
const currentFeelsLike = document.getElementById('currentFeelsLike');
const currentHumidity = document.getElementById('currentHumidity');
const currentWind = document.getElementById('currentWind');
const currentUv = document.getElementById('currentUv');
const currentPressure = document.getElementById('currentPressure');
const currentVisibility = document.getElementById('currentVisibility');
const currentPrecip = document.getElementById('currentPrecip');
const currentCloud = document.getElementById('currentCloud');

// Forecast Elements
const forecastContainer = document.getElementById('forecastContainer');

// Astronomy Elements
const astronomySunrise = document.getElementById('astronomySunrise');
const astronomySunset = document.getElementById('astronomySunset');
const astronomyMoonrise = document.getElementById('astronomyMoonrise');
const astronomyMoonset = document.getElementById('astronomyMoonset');
const astronomyMoonPhase = document.getElementById('astronomyMoonPhase');
const astronomyMoonIllumination = document.getElementById('astronomyMoonIllumination');
const astronomyDaylight = document.getElementById('astronomyDaylight');
const moonPhaseVisual = document.getElementById('moonPhaseVisual');

/**
 * Displays an error message and hides other content.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    loadingIndicator.classList.add('hidden');
    weatherContent.classList.add('hidden');
}

/**
 * Clears any existing error messages.
 */
function clearError() {
    errorMessage.classList.add('hidden');
    errorMessage.textContent = '';
}

/**
 * Formats time from 24-hour to 12-hour format
 * @param {string} timeStr - Time string in format "HH:MM"
 * @returns {string} Formatted time (e.g., "7:30 AM")
 */
function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hourNum = parseInt(hours, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Calculates daylight duration between sunrise and sunset
 * @param {string} sunrise - Sunrise time (e.g., "6:45 AM")
 * @param {string} sunset - Sunset time (e.g., "6:30 PM")
 * @returns {string} Formatted duration (e.g., "11 hours 45 minutes")
 */
function calculateDaylight(sunrise, sunset) {
    // Convert times to Date objects (using arbitrary date)
    const sunriseDate = new Date(`2000-01-01 ${sunrise}`);
    const sunsetDate = new Date(`2000-01-01 ${sunset}`);
    
    // Calculate difference in milliseconds
    const diffMs = sunsetDate - sunriseDate;
    
    // Convert to hours and minutes
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours} hours ${diffMinutes} minutes`;
}

/**
 * Updates moon phase visual based on phase name
 * @param {string} phase - Moon phase name
 */
function updateMoonPhaseVisual(phase) {
    const moonPhases = {
        'New Moon': 'far fa-circle',
        'Waxing Crescent': 'fas fa-moon waxing-crescent',
        'First Quarter': 'fas fa-moon first-quarter',
        'Waxing Gibbous': 'fas fa-moon waxing-gibbous',
        'Full Moon': 'fas fa-moon',
        'Waning Gibbous': 'fas fa-moon waning-gibbous',
        'Last Quarter': 'fas fa-moon last-quarter',
        'Waning Crescent': 'fas fa-moon waning-crescent'
    };
    
    const iconClass = moonPhases[phase] || 'fas fa-moon';
    moonPhaseVisual.innerHTML = `<i class="${iconClass} text-white text-3xl"></i>`;
}

/**
 * Determines UV index severity and returns appropriate styling
 * @param {number} uv - UV index value
 * @returns {string} CSS class for UV index display
 */
function getUvSeverity(uv) {
    if (uv <= 2) return 'uv-low';
    if (uv <= 5) return 'uv-moderate';
    if (uv <= 7) return 'uv-high';
    if (uv <= 10) return 'uv-very-high';
    return 'uv-extreme';
}

/**
 * Updates the sun position visualization
 * @param {string} sunrise - Sunrise time (e.g., "6:45 AM")
 * @param {string} sunset - Sunset time (e.g., "6:30 PM")
 */
function updateSunPosition(sunrise, sunset) {
    // Get current time
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours + currentMinutes / 60;
    
    // Convert sunrise and sunset to decimal hours
    const sunriseTime = parseTimeToDecimal(sunrise);
    const sunsetTime = parseTimeToDecimal(sunset);
    
    // Calculate sun position (0 = sunrise, 100 = sunset)
    let sunPercent = 0;
    if (currentTime < sunriseTime) {
        sunPercent = 0;
    } else if (currentTime > sunsetTime) {
        sunPercent = 100;
    } else {
        sunPercent = ((currentTime - sunriseTime) / (sunsetTime - sunriseTime)) * 100;
    }
    
    // Update sun position (with 10% padding on each side)
    sunPosition.style.left = `calc(10% + ${sunPercent * 0.8}%)`;
}

/**
 * Converts time string to decimal hours
 * @param {string} timeStr - Time string (e.g., "6:45 AM")
 * @returns {number} Decimal hours (e.g., 6.75)
 */
function parseTimeToDecimal(timeStr) {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    
    let hourNum = parseInt(hours, 10);
    if (period === 'PM' && hourNum < 12) hourNum += 12;
    if (period === 'AM' && hourNum === 12) hourNum = 0;
    
    return hourNum + parseInt(minutes, 10) / 60;
}

/**
 * Fetches weather, forecast, and astronomy data for a given city.
 * @param {string} city - The name of the city.
 */
async function fetchWeatherData(city) {
    clearError();
    loadingIndicator.classList.remove('hidden');
    weatherContent.classList.add('hidden'); // Hide previous content

    try {
        // Construct the API URL for current, forecast (3 days), and astronomy data
        const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no&alerts=no`);

        if (!response.ok) {
            // Handle HTTP errors (e.g., 400 Bad Request, 404 Not Found)
            const errorData = await response.json();
            if (errorData.error && errorData.error.message) {
                throw new Error(errorData.error.message);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log("API Response:", data); // Log the full response for debugging

        // Check if location data exists
        if (!data.location) {
            throw new Error("Location data not found in API response.");
        }

        displayWeatherData(data);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        showError(`Failed to fetch weather data: ${error.message}. Please check the city name and try again.`);
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

/**
 * Displays the fetched weather, forecast, and astronomy data on the dashboard.
 * @param {object} data - The weather data object from the API.
 */
function displayWeatherData(data) {
    // Update current date and time
    const now = new Date(data.location.localtime);
    currentDateTime.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Display Current Weather
    currentCityName.textContent = `${data.location.name}, ${data.location.country}`;
    currentWeatherIcon.src = data.current.condition.icon;
    currentWeatherIcon.alt = data.current.condition.text;
    currentTemp.textContent = `${data.current.temp_c}°C`;
    currentCondition.textContent = data.current.condition.text;
    currentFeelsLike.textContent = `${data.current.feelslike_c}°C`;
    currentHumidity.textContent = `${data.current.humidity}%`;
    currentWind.textContent = `${data.current.wind_kph} km/h ${data.current.wind_dir}`;
    
    // UV Index with severity styling
    const uvIndex = data.current.uv;
    const uvClass = getUvSeverity(uvIndex);
    currentUv.innerHTML = `<span class="uv-index ${uvClass}">${uvIndex}</span>`;
    
    // Additional weather details
    currentPressure.textContent = `${data.current.pressure_mb} hPa`;
    currentVisibility.textContent = `${data.current.vis_km} km`;
    currentPrecip.textContent = `${data.current.precip_mm} mm`;
    currentCloud.textContent = `${data.current.cloud}%`;

    // Display Forecast
    forecastContainer.innerHTML = ''; // Clear previous forecast
    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const forecastCard = document.createElement('div');
        forecastCard.classList.add('forecast-card', 'animate__animated', 'animate__fadeIn');
        forecastCard.innerHTML = `
            <div class="flex flex-col items-center text-center">
                <p class="font-bold text-xl mb-2 text-gray-100">
                    ${date.toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p class="text-gray-400 mb-3">
                    ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" 
                     class="w-20 h-20 mb-3 filter drop-shadow-md floating">
                <p class="text-2xl font-bold text-gray-100 mb-1">
                    ${day.day.maxtemp_c}° <span class="text-gray-400">/ ${day.day.mintemp_c}°</span>
                </p>
                <p class="text-gray-300 mb-2">${day.day.condition.text}</p>
                <div class="flex justify-center gap-4 mt-2">
                    <div class="flex items-center text-sm text-gray-300">
                        <i class="fas fa-tint text-blue-300 mr-1"></i>
                        <span>${day.day.daily_chance_of_rain}%</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-300">
                        <i class="fas fa-wind text-gray-300 mr-1"></i>
                        <span>${day.day.maxwind_kph} km/h</span>
                    </div>
                </div>
                <div class="w-full mt-4">
                    <div class="temp-gauge">
                        <div class="temp-fill" style="width: ${(day.day.maxtemp_c / 40) * 100}%"></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-400 mt-1">
                        <span>${day.day.mintemp_c}°</span>
                        <span>${day.day.maxtemp_c}°</span>
                    </div>
                </div>
            </div>
        `;
        forecastContainer.appendChild(forecastCard);
    });

    // Display Astronomy Data (from the first day of forecast, which is today)
    const astronomy = data.forecast.forecastday[0].astro;
    const sunriseTime = formatTime(astronomy.sunrise);
    const sunsetTime = formatTime(astronomy.sunset);
    const moonriseTime = formatTime(astronomy.moonrise);
    const moonsetTime = formatTime(astronomy.moonset);
    
    astronomySunrise.textContent = sunriseTime;
    astronomySunset.textContent = sunsetTime;
    astronomyMoonrise.textContent = moonriseTime;
    astronomyMoonset.textContent = moonsetTime;
    astronomyMoonPhase.textContent = astronomy.moon_phase;
    astronomyMoonIllumination.textContent = `${astronomy.moon_illumination}%`;
    astronomyDaylight.textContent = calculateDaylight(sunriseTime, sunsetTime);
    
    // Update moon phase visual
    updateMoonPhaseVisual(astronomy.moon_phase);
    
    // Update sun position visualization
    updateSunPosition(sunriseTime, sunsetTime);

    // Show the content with animation
    weatherContent.classList.remove('hidden');
    weatherContent.classList.add('animate__animated', 'animate__fadeIn');
}

// Event Listeners
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        showError("Please enter a city name.");
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchButton.click(); // Simulate a click on the search button
    }
});

// Create star background
createStars();

// Optional: Fetch weather for a default city on page load
window.onload = () => {
    // You can set a default city here, e.g., 'London'
    cityInput.value = 'New York'; // Example: Load weather for New York on page load
    setTimeout(() => {
        searchButton.click();
    }, 500);
};