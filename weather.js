let isCelsius = true; // शुरू में सेल्सियस है
let currentTemp = 0;  // इसे API से आने वाले तापमान को स्टोर करने के लिए इस्तेमाल करेंगे
var $ = undefined;
const apiKey = "8157cbf278d3e9c25311586129f45df3";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

async function checkWeather(city) {
  if (!city) return;
   document.querySelectorAll(".status-btn").forEach(btn => btn.innerText = "Status: Loading...");

  try {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
      alert("City not found! Please check the spelling.");
    } else {
      const data = await response.json();
        document.querySelectorAll(".status-btn").forEach(btn => btn.innerText = "Status: Active");
      document.getElementById("humidity").innerHTML = data.main.humidity;
      document.getElementById("clouds").innerHTML = data.clouds.all;
      document.getElementById("pressure").innerHTML = data.main.pressure;

      document.getElementById("wind").innerHTML = data.wind.speed;
      document.getElementById("wind_deg").innerHTML = data.wind.deg;
      document.getElementById("visibility").innerHTML = data.visibility / 1000;

      document.getElementById("feels_like").innerHTML = Math.round(
        data.main.feels_like,
      );
      document.getElementById("weather_type").innerHTML = data.weather[0].main;
      document.getElementById("cityName").innerHTML = data.name;
       currentTemp = data.main.temp;
      document.getElementById("temp").innerHTML = Math.round(data.main.temp);
      // डेटा मिलने के तुरंत बाद ये लाइन लिखो
      saveToHistory(data.name);
      document.getElementById("humidity").innerHTML = data.main.humidity;
      document.getElementById("wind").innerHTML = data.wind.speed;
      // यह लाइन ढूंढो जहाँ तुम शहर का नाम अपडेट कर रहे हो
       document.getElementById("forecastHeading").innerText = "5-Day Forecast for " + data.name;
       addWeatherAlert(Math.round(data.main.temp), data.weather[0].main);
      //      5-दिन का फोरकास्ट
      // 5-दिन का फोरकास्ट (प्रोफेशनल लुक)
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`;
      const forecastRes = await fetch(forecastUrl);
      const forecastData = await forecastRes.json();

      const forecastBox = document.getElementById("forecastBox");
      forecastBox.innerHTML = ""; // पुराने कार्ड्स साफ करने के लिए

      const dailyData = forecastData.list.filter((item) =>
        item.dt_txt.includes("12:00:00"),
      );

      dailyData.forEach((day) => {
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
          weekday: "short",
        });
        forecastBox.innerHTML += `
                <div class="col">
                    <div class="card h-100 shadow-sm border-0 bg-light">
                        <div class="card-body p-2">
                            <p class="fw-bold mb-1">${date}</p>
                            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" width="45" alt="Weather icon"></img>
                            <h5 class="fw-bold text-primary mt-2">${Math.round(day.main.temp)}°C</h5>
                        </div>
                    </div>
                </div>`;
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
searchBtn.addEventListener("click", () => {
  if (searchBox.value === "") {
    alert("Please enter a city name!");
  } else {
    checkWeather(searchBox.value);
  }
});


searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    checkWeather(searchBox.value);
  }
});

async function updatePopularCities() {
  const cities = ["Mumbai", "Kolkata", "Varanasi", "Haridwar"]; // यहाँ और भी शहर जोड़ सकते हो

  for (const city of cities) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`,
      );
      const data = await response.json();

      // शहर के नाम के हिसाब से रो (row) ढूंढें
      const row = document.getElementById(`city-${city}`);
      if (row) {
        // row.querySelector(".wind-speed").innerHTML = data.wind.speed + " km/h";
        // row.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        // लूप के अंदर पहले ये फेच कॉल करो (lat और lon के साथ)
        const pollResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`,
        );
        const pollData = await pollResponse.json();

        // फिर AQI को अपडेट करो
        const aqiMap = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
        row.querySelector(".aqi").innerHTML = aqiMap[pollData.list[0].main.aqi];
        row.querySelector(".uv").innerHTML = "Moderate"; // यह फिक्स रहेगा क्योंकि फ्री API में यह नहीं मिलता
        row.querySelector(".sunrise").innerHTML = new Date(
          data.sys.sunrise * 1000,
        ).toLocaleTimeString();
        row.querySelector(".sunset").innerHTML = new Date(
          data.sys.sunset * 1000,
        ).toLocaleTimeString();
        row.querySelector(".max-temp").innerHTML =
          Math.round(data.main.temp_max) + "°C";
        row.querySelector(".min-temp").innerHTML =
          Math.round(data.main.temp_min - 4) + "°C";
      }
    } catch (e) {
      console.log("Error loading city:", city);
    }
  }
}

// पेज लोड होने के कुछ देर बाद इसे चलाएं
window.addEventListener("load", () => {
  setTimeout(updatePopularCities, 1000);
});

document.getElementById("shareBtn").addEventListener("click", async () => {
  const shareData = {
    title: "My Cool Weather App",
    text: "Check out the real-time weather at this location!",
    url: "https://sonar0099.github.io/Weather-app/", // यहाँ पक्का GitHub का लिंक डालो
  };

  try {
    await navigator.share(shareData);
  } catch (err) {
    console.log("Share failed:", err);
    // अगर शेयर API काम न करे, तो लिंक कॉपी कर लो
    alert("Share failed, but here is your link: " + shareData.url);
  }
});

function addWeatherAlert(temp, condition) {
    const alertBox = document.getElementById("weatherAlert");
    let message = "";
    let bgColor = "#ff4907"; // पीला (गर्मी के लिए)

    if (temp > 40) {
            message = "⚠️ Heat Alert: Temperature is high! बाहर निकलते समय पानी साथ रखें, सनग्लासेस (sunglasses) पहनें और सूती (cotton) कपड़े पहनें!";
    } else if (condition.toLowerCase().includes("rain")) {
        message = "☔ Rain Alert: बारिश हो सकती है, छाता साथ रखें!";
        bgColor = "#17a2b8"; // नीला (बारिश के लिए)
    }

    if (message) {
        alertBox.innerText = message;
        alertBox.style.backgroundColor = bgColor;
        alertBox.style.display = "block";
        // ऊपर मार्जिन दें ताकि ऐप नीचे खिसक जाए और बटन न छुपें
        document.body.style.paddingTop = "40px"; 
    } else {
        alertBox.style.display = "none";
        document.body.style.paddingTop = "0";
        
    }
}

document.getElementById("unitToggle").addEventListener("click", () => {
    const tempElement = document.getElementById("temp");
    const unitButton = document.getElementById("unitToggle");

    if (isCelsius) {
        // C to F conversion
        let fahrenheit = (currentTemp * 9/5) + 32;
        tempElement.innerHTML = Math.round(fahrenheit);
        unitButton.innerHTML = "Switch to °C";
        isCelsius = false;
    } else {
        // Back to C
        tempElement.innerHTML = Math.round(currentTemp);
        unitButton.innerHTML = "Switch to °F";
        isCelsius = true;
    }
});

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    
    // शहर को लिस्ट से हटाओ अगर पहले से है, फिर उसे सबसे ऊपर जोड़ो
    history = [city, ...history.filter(item => item !== city)];
    
    // सिर्फ लेटेस्ट 5 शहर रखो
    history = history.slice(0, 5); 
    
    localStorage.setItem("searchHistory", JSON.stringify(history));
    updateHistoryUI();
}

function updateHistoryUI() {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    const dataList = document.getElementById("historyList");
    dataList.innerHTML = ""; // पुरानी लिस्ट हटाओ
    history.forEach(city => {
        dataList.innerHTML += `<option value="${city}">`;
    });
}

// पेज लोड होते ही पुरानी लिस्ट दिखाओ
updateHistoryUI();