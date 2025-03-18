const API_KEY = "42d606ad07f74501a7e54114250702";
async function getWeather() {
    let city = document.getElementById("city").value;
    if (!city) return alert("Please enter a city");
    fetchWeather(city);
}     
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetchWeather(`${latitude},${longitude}`);
        }, () => alert("Unable to retrieve your location"));
    } else {
        alert("Geolocation is not supported by this browser");
    }
}   
async function fetchWeather(location) {
    const weatherResponse = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=no&alerts=no`);
    const weatherData = await weatherResponse.json();

    if (weatherData.error) return alert("Location not found");
    
    const weather = weatherData.current;
    let forecastHTML = `
        <h2>${weatherData.location.name}, ${weatherData.location.country}</h2>
        <p>Temperature: ${weather.temp_c}°C</p>
        <p>Wind Speed: ${weather.wind_kph} km/h</p>
        <p>Condition: ${weather.condition.text}</p>
        <img src="${weather.condition.icon}" alt="Weather icon" class="weather-icon">
        <h3>3-Day Forecast</h3>
    `;
    
    weatherData.forecast.forecastday.forEach(day => {
        forecastHTML += `
            <div class="forecast-day">
                <p><strong>${day.date}</strong></p>
                <p>Max Temp: ${day.day.maxtemp_c}°C</p>
                <p>Min Temp: ${day.day.mintemp_c}°C</p>
                <p>Condition: ${day.day.condition.text}</p>
                <img src="${day.day.condition.icon}" alt="Weather icon" class="weather-icon">
            </div>
        `;
    });
    
    document.getElementById("weather-container").innerHTML = forecastHTML;
    
    // Change background based on weather condition
    setWeatherBackground(weather.condition.text);
}

function setWeatherBackground(condition) {
    let bgImage = "";

    if (condition.includes("Sunny")) {
        bgImage = "url('https://images.stockcake.com/public/3/5/0/35000166-188c-4bbd-ac7d-0941be325558_large/sunny-cloud-filled-sky-stockcake.jpg')";
    } else if (condition.includes("Rain")) {
        bgImage = "url('https://images.news18.com/ibnlive/uploads/2021/07/1627056776_clouds-1200x800.jpg')";
    } else if (condition.includes("Cloud")) {
        bgImage = "url('https://i2.pickpik.com/photos/229/664/988/white-cloud-sky-beautiful-sky-cloud-sky-b0445c7320b0771908b8901a762a2d94.jpg')";
    } else if (condition.includes("Snow")||condition.includes("Heavy Snow") ||condition.includes("Light Snow")) {
        bgImage = "url('https://media.istockphoto.com/id/614332492/photo/snow-storm.jpg?s=612x612&w=0&k=20&c=UT779vnlT6q5tRGHR_JbweEC8L0tHbXMeogrAqJeQSo=')";
    } else {
        bgImage = "url('https://wpcdn.us-east-1.vip.tn-cloud.net/www.klkntv.com/content/uploads/2020/04/cloud1.jpg')";
    }
    document.body.style.backgroundImage = bgImage;
    document.body.style.backgroundSize = "cover"; 
    document.body.style.backgroundPosition = "center"; 
    document.body.style.backgroundRepeat = "no-repeat"; 
    document.body.style.backgroundAttachment = "fixed";
}
