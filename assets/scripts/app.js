'use strict'

$(document).ready(function(){

    var options = {hover: true};
    var elem = document.querySelector('.dropdown-trigger');
    var instance = M.Dropdown.init(elem, options);  

  // Global Variables
  const apiKey = "IB4MtYCaYXdQIdqm4K7847xEzhASkSEll2GFdl2tKVcElY8dSP3w-LCa03qSscEkwKVncUnsR5AizTA7EdD7FHmM1Qsr781Rsc3EqeKCIDw7jd8PFMRNaK1OwXS6WnYx"
  let fetchUrl;
  let userLat;
  let userLng;
  let miles;
  let meters;
  let starPaths = [
    // 0 Star Image Index 0
    "./assets/images/yelp_stars/regular_0.png", 
    // 1.5 Star Image Index 1
    "./assets/images/yelp_stars/regular_1_half.png",
    // 1 Star Image Index 2
    "./assets/images/yelp_stars/regular_1.png",
    // 2.5 Star Image Index 3
    "./assets/images/yelp_stars/regular_2_half.png",
    // 2 Star Image Index 4
    "./assets/images/yelp_stars/regular_2.png",
    // 3.5 Star Image Index 5
    "./assets/images/yelp_stars/regular_3_half.png",
    // 3 Star Image Index 6
    "./assets/images/yelp_stars/regular_3.png",
    // 4.5 Star Image Index 7
    "./assets/images/yelp_stars/regular_4_half.png",
    // 4 Star Image Index 8
    "./assets/images/yelp_stars/regular_4.png",
    // 5 Star Image Index 9
    "./assets/images/yelp_stars/regular_5.png"
  ]

  // General Use Functions
  function milesToMeters (miles){
    return Math.floor(miles * 1609.34);
  };

  function determineStars(rating) {
    let imgPath;

    if (rating == 0) {
      imgPath = starPaths[0] 

    } else if (rating == 1) {
      imgPath = starPaths[2]

    } else if (rating == 1.5) {
      imgPath = starPaths[1]

    } else if (rating == 2) {
      imgPath = starPaths[4]

    } else if (rating == 2.5) {
      imgPath = starPaths[3]

    } else if (rating == 3) {
      imgPath = starPaths[6]

    } else if (rating == 3.5) {
      imgPath = starPaths[5]

    } else if (rating == 4) {
      imgPath = starPaths[8]

    } else if (rating == 4.5) {
      imgPath = starPaths[7]

    } else if (rating == 5) {
      imgPath = starPaths[9]

    } else {
      console.log("There is an error with the rating")
    }

    return imgPath

  };

  function bizIteration (array) {
    for (let i = 0; i < array.length; i++) {
  
      let currentBiz = array[i]
      let newBrewSpan = $("<span>")
      let newBrewDiv = $("<div>")

      newBrewDiv.attr("class", "brewery-div row z-depth-2")
      newBrewDiv.attr("id", currentBiz.id)
  
      let colLeft = $("<div>").attr("class", "col s12 m4")
      let colCenter = $("<div>").attr("class", "col s12 m4")
      let colRight = $("<div>").attr("class", "col s12 m4")
  
      // Left Column Elements
      let breweryName = $("<h4>")
      breweryName.text(currentBiz.name)
  
      let breweryImg = $("<img>").attr("src", currentBiz.image_url)
      breweryImg.attr("class", "responsive-img brewery-img")
  
      newBrewSpan.append(breweryName)
      colLeft.append(breweryImg)
  
  
      // Center Column Elements
      let yelpImg = determineStars(currentBiz.rating)
      let rating = $("<img>").attr("src", yelpImg)
      let cost = $("<p>").attr("id", 'cost')
      let status = $("<p>").attr("id", 'status')
  
      rating.text(currentBiz.rating)
      cost.text(`Price Range: ${currentBiz.price}`)
  
      if(currentBiz.is_closed) {
        status.text("Currently Closed")
      } else {
        status.text("Currently Open")
      }
  
      colCenter.append(rating, cost, status)
  
      // Right Column Elements
      let distance = $("<p>").attr("id", "distance")
      let address  = $("<p>").attr("id", "address")
      let phoneLink = $("<a>").attr("href", `tel:${currentBiz.phone}`)
      let yelpPage = $("<a>").attr("id", "yelp-page")
  
      address.html("Address:" + "<br>" + currentBiz.location.display_address[0] + "<br>" + currentBiz.location.display_address[1])
      phoneLink.html(`Phone:<br>${currentBiz.display_phone}<br><br>`)
      yelpPage.text("View on Yelp")
      yelpPage.attr("href", currentBiz.url)
  
      colRight.append(address, phoneLink, yelpPage)
  
      // Adding Elements to the page
      newBrewDiv.append(newBrewSpan, colLeft, colCenter, colRight)
      $("#breweryElement").append(newBrewDiv)
  
    }
  
  }

  // Parallax Function
  $('.parallax').parallax();

  // On Click function for Specified Location
  $("#searchButton").on("click", function(e) {
    event.preventDefault();
    miles = parseInt($("#icon_prefix").val())

    // Checks to make sure miles is a number
    if (isNaN(miles)) {
      meters = milesToMeters(5);
    } else {
      meters = milesToMeters(miles);
    }

    // Removes previously Viewed Breweries
    $("#breweryElement").empty()

    //catches information from search field. 
    let searchTitle = $("#searchField").val();
    let codedSearchTitle = encodeURIComponent(searchTitle);

    //attaches User search result to the https address required by googlemaps api
    let userPreLimSearch = "https://maps.googleapis.com/maps/api/geocode/json?address="+ codedSearchTitle +"&key=AIzaSyBSnJtTqZp2Nzg7w1o1rF19y2Eic3IuhCQ"

  
    $.ajax({
      url: userPreLimSearch,
      method: "GET",
    })
    .then(function(response){
      //gains access to the geocoded latitude and longitude from googlemaps object
      userLat = response.results[0].geometry.location.lat;
      userLng = response.results[0].geometry.location.lng;

      // Start of Geolocation fucntioN
      let fetchUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=breweries&latitude=${userLat}&longitude=${userLng}&radius=${meters}`

      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + apiKey);

      fetch(fetchUrl, {
        headers: myHeaders 
      }).then((res) => {
        return res.json();
      }).then((json) => {

        let listOfBusinesses = json.businesses
        console.log(listOfBusinesses)

        // Iterates through the list of businesses and creats divs
        bizIteration(listOfBusinesses)

      });

    })

  });

  // On Click Function for Current Location
  $("#current-location").on("click", function () {
    
    miles = parseInt($("#icon_prefix").val())

    // Checks to make sure miles is a number
    if (isNaN(miles)) {
      meters = milesToMeters(5);
    } else {
      meters = milesToMeters(miles);
    }

    // Removes previously Viewed Breweries
    $("#breweryElement").empty()

    // Start of Geolocation fucntion
    navigator.geolocation.getCurrentPosition(function(position) {

      // variables for holding current latitdue and longitude
      userLat = position.coords.latitude
      userLng = position.coords.longitude

      // Changes the fetch URL
      fetchUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=breweries&latitude=${userLat}&longitude=${userLng}&radius=${meters}`

      // Creates the headers class object that holds the API key
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + apiKey);

      // Fetch Function
      fetch(fetchUrl, {
        headers: myHeaders 
      }).then((res) => {
        return res.json();
      }).then((json) => {

        let listOfBusinesses = json.businesses
        console.log(listOfBusinesses)

        // Iterates through the list of businesses and creates divs
        bizIteration(listOfBusinesses)

      });

    });

  });

});