//query selectors
const burgerIcon = document.querySelector('#menu');
const navbarMenu = document.querySelector('#nav-links');
var zipSearchText = document.querySelector('#search-content');
var searchButton = document.querySelector('#search-button');
var map = document.getElementById('map');


//get geolocation with zipcode
var getGeoLoc = function(event) {
  //prevent auto refresh on click
  event.preventDefault();

  var zipCode = zipSearchText.value;
  console.log(zipCode);
  //reset text field
  //zipSearchText.value = "";

  //api url (geolocation)
  var geoApiUrl = "http://api.openweathermap.org/geo/1.0/zip?zip=" + zipCode + "&appid=6c1a0cb9791079e8155bbd6c4f59e4da";

  //request for url
  fetch(geoApiUrl)
  .then(function(response) {
    if (response.ok) {
      //convert response to json
      response.json().then(function(data) {
        

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
  .catch(function(error) {
    //maybe display error on DOM instead of alert later on
    console.log("Could not connect to GeoLocationAPI");
  });

}

//pass geolocation info into weather api
var getLocalWeather = function(longitude, latitude) {
  
  //confirm data passed through
  console.log("lon:" + longitude, "lat:" + latitude);

  var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=6c1a0cb9791079e8155bbd6c4f59e4da";

  fetch(weatherApiUrl)
  .then(function(response) {
    if (response.ok) {
      //convert response to json
      response.json().then(function(data) {
        
        //weather json 
        console.log(data);

      });
    }
  })
  
}

//yelp API function
// var yelpQuery=function(longitude, latitude){
//   var yelpUrl = "https://api.yelp.com/v3/businesses/search?latitude=" + latitude + "&longitude=" + longitude;
//   fetch(yelpUrl)
//   .then(function(response) {
//     if (response.ok) {
//       //convert response to json
//       response.json().then(function(data){
//         console.log(data);
//       })
//     }
//   });
// }

var breweryQuery=function(longitude, latitude){
    var breweryAPIUrl = "https://api.openbrewerydb.org/breweries?by_dist=" + latitude + "," + longitude;
    fetch(breweryAPIUrl)
    .then(function(response) {
      if (response.ok) {
        //convert response to json
        response.json().then(function(data){
          console.log(data);
        })
      }
    });
  }

//takes zipcode input and gets geolocation
searchButton.addEventListener('click', getGeoLoc);

burgerIcon.addEventListener('click', () => {
  navbarMenu.classList.toggle('is-active');
});