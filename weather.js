let btnCurrent = document.getElementById("btnCurrent");
let btnForecast = document.getElementById("btnForecast");
let btnHistory = document.getElementById("btnHistory");

let box = document.querySelector(".box");

function currentWeather(location) {
  box.innerHTML = `<span id="condition">
                 </span>
                <span id="tempBox">
                    <p id="tempTitle">Temperature</p>
                    <span id="temp">
                        <p id="temperature"></p>
                        <select id="tempUnit">
                            <option value="celsius">°C</option>
                            <option value="fahrenheit">F</option>
                        </select>
                    </span>
                </span>
                <span>
                    <p id="humidityTitle">Humidity</p>
                    <p id="humidity"></p>
                </span>
                <span>
                    <p id="windSpeedTitle">Wind Speed</p>
                    <span id="speed">
                        <p id="windSpeed"></p>
                        <select id="speedUnit">
                            <option value="kph">kmph</option>
                            <option value="mph">mph</option>
                        </select>
                    </span>
                </span>
                <span>
                    <p id="weatherDesTitle">Weather Description</p>
                    <p id="weatherDes"></p>
                </span>`;

  let temperature = document.getElementById("temperature");
  let humidity = document.getElementById("humidity");
  let wind = document.getElementById("windSpeed");
  let discription = document.getElementById("weatherDes");
  let condition = document.getElementById("condition");
  let unit = document.getElementById("tempUnit");
  document.getElementById("title").innerHTML = "Current Weather";

  fetch(
    `http://api.weatherapi.com/v1/current.json?key=278b2f0bf4df4a3988b75530240309&q=${location}&aqi=yes`
  )
    .then((res) => res.json())
    .then((data) => {
      condition.innerHTML = `<img id="condition" src="${data.current.condition.icon}" alt="condition img">`;

      function updateWindSpeed() {
        if (speedUnit.value === "kph") {
          wind.innerHTML = `${data.current.wind_kph}`;
        } else {
          wind.innerHTML = `${data.current.wind_mph}`;
        }
      }

      function updateTemperature() {
        if (tempUnit.value === "celsius") {
          temperature.innerHTML = `${data.current.temp_c}`;
        } else {
          temperature.innerHTML = `${data.current.temp_f}`;
        }
      }

      updateTemperature();
      updateWindSpeed();

      humidity.innerHTML = data.current.humidity + "%";
      discription.innerHTML = data.current.condition.text;

      tempUnit.addEventListener("change", () => {
        updateTemperature();
      });

      speedUnit.addEventListener("change", () => {
        updateWindSpeed();
      });
    })
    .catch((err) => {
      alert("Location not found!!! Please enter valid location");
    });
}

let inputLocation = document.getElementById("location");

btnCurrent.addEventListener("click", () => {
  currentWeather(inputLocation.value);
});

//forecast weather
function forecastWeather(location) {
  box.innerHTML = "";
  let table = document.createElement("table");
  table.setAttribute("id", "tblWeather");
  let body = `<tr>
                <th>Date</th> 
                <th>Average Temperature(°C)</th>
                <th>Average Humidity(%)</th>
                <th>Max wind speed(kmph)</th>
                <th>Condition</th>
                <th>weather description</th> 
              </tr>`;
  document.getElementById("title").innerHTML =
    "Forecast Weather for upcoming 7 days";
  fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=278b2f0bf4df4a3988b75530240309&q=${location}&days=7&aqi=yes&alerts=yes`
  )
    .then((res) => res.json())
    .then((data) => {
      data.forecast.forecastday.forEach((element) => {
        body += `<tr>
                    <td>${element.date}</td>
                    <td>${element.day.avgtemp_c}</td>
                    <td>${element.day.avghumidity}</td>
                    <td>${element.day.maxwind_kph}</td>
                    <td><img src="${element.day.condition.icon}" alt="condition img" id="condition"></td>
                    <td>${element.day.condition.text}</td>
                  </tr>`;
      });
      table.innerHTML = body;
      box.appendChild(table);
    })
    .catch((err) => {
      alert("Location not found!!! Please enter valid location" + err);
    });
}

btnForecast.addEventListener("click", () => {
  forecastWeather(inputLocation.value);
});

//historical weather
let date = document.getElementById("date");

let today = new Date();

let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();

let currentDate = `${day}-${month}-${year}`;

function historicalWeather(location, date) {
  if (!(date === "" && location === "" && date < currentDate)) {
    box.innerHTML = "";
    let table = document.createElement("table");
    table.setAttribute("id", "tblWeather");
    let body = `<tr>
                <th>Date</th> 
                <th>Average Temperature(°C)</th>
                <th>Average Humidity(%)</th>
                <th>Max wind speed(kmph)</th>
                <th>Condition</th>
                <th>weather description</th> 
              </tr>`;
    document.getElementById("title").innerHTML =
      "Weather details for the date : " + date;
    fetch(
      `http://api.weatherapi.com/v1/history.json?key=278b2f0bf4df4a3988b75530240309&q=${location}&dt=${date}`
    ) //this could not be done as the api does not support historical weather data. it is not a free version
      .then((res) => res.json())
      .then((data) => {
        console.log(data.forecast.forecastday);
        data.forecast.forecastday.forEach((element) => {
          body += `<tr>
                    <td>${element.date}</td>
                    <td>${element.day.avgtemp_c}</td>
                    <td>${element.day.avghumidity}</td>
                    <td>${element.day.maxwind_kph}</td>
                    <td><img src="${element.day.condition.icon}" alt="condition img" id="condition"></td>
                    <td>${element.day.condition.text}</td>
                  </tr>`;
        });
        table.innerHTML = body;
        box.appendChild(table);
      })
      .catch((err) => {
        alert(
          "Date and location hould not be empty and date should be less than current date for Historical Weather"
        );
      });
  } else {
    alert("Please enter valid location and date");
  }
}

btnHistory.addEventListener("click", () => {
  historicalWeather(inputLocation.value, date.value);
});
