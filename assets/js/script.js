//search history array
var searchHistory = [];

//query selectors
const burgerIcon = document.querySelector("#menu");
const navbarMenu = document.querySelector("#nav-links");
var zipSearchText = document.querySelector("#search-content");
var searchButton = document.querySelector("#search-button");
var savedButton = document.querySelector("#savedbtn");
var map = document.getElementById("map");
var weatherCard = document.querySelector("#weather-card");
var brewEl = document.querySelector("#barContainer");
var brewCardContEl = document.querySelector("#brewcard-container");
var searchfieldEl = document.querySelector("#searchField");
var weatherContainer = document.querySelector("#weather-text");
var modalSearch = document.querySelector("#search-history");
var zipHistory = document.querySelector("#lsHistory");

//get geolocation with zipcode
var getGeoLoc = function (event) {
  //prevent auto refresh on click
  event.preventDefault();

  //clear previous search content
  weatherCard.textContent = "";
  brewCardContEl.textContent = "";

  var zipCode = zipSearchText.value;
  console.log(zipCode);

  //api url (geolocation)
  var geoApiUrl =
    "https://api.openweathermap.org/geo/1.0/zip?zip=" +
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
        //console.log(data);
        brewName(data);
      });
    }
  });
};

var brewName = function (data) {
  console.log(data);
  //loop names
  for (var i = 0; i < 5; i++) {
    var barName = data[i].name;
    var brewAddy = data[i].street;
    console.log(barName);

    //create element to hold bar name
    var brewCard = document.createElement("div");
    var breweryName = document.createElement("h3");
    var imageplaceholder = document.createElement("div");
    var brewAddress = document.createElement("p");

    //append to div

    brewCardContEl.appendChild(brewCard);
    brewCard.appendChild(breweryName);
    brewCard.appendChild(imageplaceholder);
    brewCard.appendChild(brewAddress);
    //add content to created elements
    breweryName.innerText = barName;
    brewAddress.innerText = brewAddy;
    imageplaceholder.innerHTML = "<img src='./assets/images/beerlogo.jpg'>";
    //attributes
    $(brewEl).addClass("row");
    $(brewCardContEl).addClass("columns");
    $(brewCard).addClass("column card brewcard");
    $(searchfieldEl).addClass("row");
    $(weatherContainer).addClass("row");
  }
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

    //attributes
    $(divEl).addClass("column card weathercard");
  }
};

//set search input to local storage
var assignLocalStorage = function (event) {
  //add search to variable
  var zipcodeHistory = zipSearchText.value;
  console.log(zipcodeHistory);

  //reset input text field
  zipSearchText.value = "";

  //add search input to searchHistory array
  searchHistory.push(zipcodeHistory);

  //set array to local storage
  localStorage.setItem("zipcode", JSON.stringify(searchHistory));

  printLocal();
};

var printLocal = function () {
  //check if there is anything in localStorage
  var localZip = localStorage.getItem("zipcode");

  //if localstorgae exists, parse it and assign the array values to the
  if (localZip) {
    //clear array to accept local storage info
    searchHistory = [];

    //parse localStorage
    localZip = JSON.parse(localZip);

    //assign array to searchHistory array
    searchHistory = localZip;
  } else {
    return;
    //local storage print to p element modal
  }
  zipHistory.innerText = searchHistory;
};

//takes zipcode input and gets geolocation
searchButton.addEventListener("click", getGeoLoc);

//takes zipcode and adds it to localStorage
searchButton.addEventListener("click", assignLocalStorage);

burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});

document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    // console.log($target);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      // Escape key
      closeAllModals();
    }
  });
});
