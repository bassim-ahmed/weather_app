const searchButton = document.getElementById("search-btn");
const locationButton = document.querySelector(".location-btn");
const cityInput = document.getElementById("city-input");
const weatherCardsDiv= document.querySelector(".future-forecast");
const currentWeatherDiv= document.querySelector(".info");
const API_KEY = "98390c590e9b87215cea6dd02bf39f33";
const CreateWeatherCard=(cityName,weatherItem,index)=>{
    if(index==0){
        return `
       
        <div class="date-container">
        <div class="date" id="date">${weatherItem.dt_txt.split(" ")[0]} 
        </div>
        <div class="others" id="current-weather-items">
          <div class="weather-item">
            <div>Temperature</div>
            <div>${(weatherItem.main.temp - 273.15).toFixed(2)} °C</div>
          </div>
          <div class="weather-item">
            <div>Wind</div>
            <div>${weatherItem.wind.speed}  km/h</div>
          </div>
          <div class="weather-item">
            <div>Humidity</div>
            <div>${weatherItem.main.humidity} %</div>
          </div>
          <div class="weather-item">
            <div>${weatherItem.weather[0].description}</div>
            <div> <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" class="w-icon"></div>
          </div>
        </div>
      </div>
      <div class="place-container">
        <div class="time-zone" id="time-zone">
         <div id="cityname" class="city">${cityName}</div>
        </div>
       </div>
        `; 
    }else{
        return ` <div class="card bg-transparent" style="width: 18rem;">
        <div class="card-body text-light text-center">
          <h5 class="card-title">${weatherItem.dt_txt.split(" ")[0]}</h5>
          <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" class="card-img-top" alt="...">
          <div class="others" id="current-weather-items">
            <div class="weather-item">
              <div>Temperature</div>
              <div>${(weatherItem.main.temp - 273.15).toFixed(2)}°C</div>
            </div>
            <div class="weather-item">
              <div>Wind</div>
              <div>${weatherItem.wind.speed} M/S</div>
            </div>
            <div class="weather-item">
              <div>Humidity</div>
              <div>${weatherItem.main.humidity}%</div>
            </div>
       
          </div>
     
        </div>
      </div>
        
        `;
    }

}

const getWeatherDetails=(cityName,lat,lon)=>{
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
        //filter unique dates
        const uniqueForecastDays=[];
      const threeDaysForecast=data.list.filter((forecast) =>{
        const forecastDate=new Date(forecast.dt_txt).getDate();
         
        if(!uniqueForecastDays.includes(forecastDate)){
            if(uniqueForecastDays.length<=3){
                return uniqueForecastDays.push(forecastDate);
            }
               
            
        }
       } )
       //clear 
       cityInput.value=""
       weatherCardsDiv.innerHTML ="" 
       currentWeatherDiv.innerHTML =""
      
      console.log(threeDaysForecast)
       threeDaysForecast.forEach((weatherItem,index) => {
        if(index==0){
            currentWeatherDiv.innerHTML += CreateWeatherCard(cityName,weatherItem,index);
        }else{
            weatherCardsDiv.innerHTML += CreateWeatherCard(cityName,weatherItem,index);
        }
     
        
       });
    }).catch(() => alert("An error occurred while fetching data. Please try again later."));
}
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();//The `trim()` function in JavaScript is used to remove white spaces 
     if(!cityName) return;//if city name is empty
    //  console.log(cityName);
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
        if(!data.length) return alert(`no data found for ${cityName}`);
        const {name,lat,lon} = data[0];//destruct 
        getWeatherDetails(name,lat,lon);
    }).catch(() => alert("An error occurred while fetching data. Please try again later."));

}
const getUserCoordinates =() => {
  navigator.geolocation.getCurrentPosition(
    position=>{
      const { latitude, longitude } = position.coords;
      const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      const { name } = data[0];
      getWeatherDetails(name, latitude, longitude);
    }).catch(() => alert("An error occurred while find city"));

    },
   error =>{
    if (error.code === error.PERMISSION_DENIED) {
      alert("Geolocation request denied. Please reset location permission to grant access again.");
  }
   }
  );
}

searchButton.addEventListener("click",  getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);
