//query selectors
const burgerIcon = document.querySelector("#menu");
const navbarMenu = document.querySelector("#nav-links");
var zipSearchText = document.querySelector("#search-content");
var searchButton = document.querySelector("#search-button");
var map = document.getElementById("map");
var weatherCard = document.querySelector("#weather-text");

//get geolocation with zipcode
var getGeoLoc = function (event) {
  //prevent auto refresh on click
  event.preventDefault();

  var zipCode = zipSearchText.value;
  console.log(zipCode);
  //reset text field
  //zipSearchText.value = "";

  //api url (geolocation)
  var geoApiUrl =
    "http://api.openweathermap.org/geo/1.0/zip?zip=" +
    zipCode +
    "&appid=6c1a0cb9791079e8155bbd6c4f59e4da";

  //request for url
  fetch(geoApiUrl)
    .then(function (response) {
      if (response.ok) {
        //convert response to json
        response.json().then(function (data) {
          console.log(data);

          //retrieve lon + lat info for zipcode
          var longitude = data.lon;
          var latitude = data.lat;

          getLocalWeather(longitude, latitude);
          breweryQuery(longitude, latitude);
        });
      }
    })

    //catch rejected api requests
    .catch(function (error) {
      //maybe display error on DOM instead of alert later on
      console.log("Could not connect to GeoLocationAPI");
    });
};

//pass geolocation info into weather api
var getLocalWeather = function (longitude, latitude) {
  //confirm data passed through
  console.log("lon:" + longitude, "lat:" + latitude);

  var weatherApiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&units=imperial&appid=6c1a0cb9791079e8155bbd6c4f59e4da";

  fetch(weatherApiUrl).then(function (response) {
    if (response.ok) {
      //convert response to json
      response.json().then(function (data) {
        //weather json
        console.log(data);

        //pass data to setWeatherInfo
        setWeatherInfo(data);
      });
    }
  });
};

//https://www.openbrewerydb.org/
var breweryQuery = function (longitude, latitude) {
  //per_page=# will set how many breweries per call
  var breweryAPIUrl =
    "https://api.openbrewerydb.org/breweries?per_page=50&by_dist=" +
    latitude +
    "," +
    longitude;
  fetch(breweryAPIUrl).then(function (response) {
    if (response.ok) {
      //convert response to json
      response.json().then(function (data) {
        console.log(data);
      });
    }
  });
};

//print weather information ~ pass JSON from weather fetch.
var setWeatherInfo = function (data) {
  //check data
  console.log(data);

  //get current date
  var date = new Date();
  console.log(date);

  //loop and create 5 day weather forecast
  for (var i = 0; i < 5; i++) {
    //create div to hold each forcast
    var divEl = document.createElement("div");
    // var newCard = document.createElement(".weatherCard");
    //create date
    var dateEl = document.createElement("p");

    //take unix time from JSON, multiply it by 1000, pass it into new Date()
    //trim additional time information
    var unix = data.daily[i].dt;
    var unixConvert = unix * 1000;
    var unixTime = new Date(unixConvert);
    var trimmedTime = unixTime.toDateString("en-US");

    //assign time to created dateEl
    dateEl.textContent = trimmedTime;

    //create temperature element
    var tempEl = document.createElement("p");

    //assign tempEl value of temperature from JSON
    tempEl.textContent = data.daily[i].temp.day + " \u00B0 F";

    //append elemetns to weather div
    divEl.appendChild(dateEl);
    divEl.appendChild(tempEl);
    weatherCard.appendChild(divEl);
  }
};

//takes zipcode input and gets geolocation
searchButton.addEventListener("click", getGeoLoc);

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});
