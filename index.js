let locateBtn = document.querySelector("#locate-btn");
let locationStatus = document.querySelector("#status");
let latitude = document.querySelector("#latitude");
let longitude = document.querySelector("#longitude");
let detailCity = document.querySelector("#detail-city");
let detailState = document.querySelector("#detail-state");
let detailCountry = document.querySelector("#detail-country");
let detailCountryCode = document.querySelector("#detail-country-code");
let detailPostcode = document.querySelector("#detail-postcode");
let detailCounty = document.querySelector("#detail-county");
let detailMunicipality = document.querySelector("#detail-municipality");
let detailDistrict = document.querySelector("#detail-district");
let detailDisplayName = document.querySelector("#detail-display-name");

let detailAddressType = document.querySelector("#detail-addresstype");
let detailCategory = document.querySelector("#detail-category");
let detailType = document.querySelector("#detail-type");
let detailName = document.querySelector("#detail-name");
let detailPlaceRank = document.querySelector("#detail-place-rank");
let address = document.querySelector("#address");
let metadata = document.querySelector("#metadata");
let locationDetails = document.querySelector("#location-details");
let toggleDetails = document.querySelector("#toggle-details");
let themeToggle = document.querySelector("#theme-toggle");
let themeIcon = document.querySelector("#theme-icon");
let theme = document.querySelector("#theme");
let locoraFooter = document.querySelector("#locoraFooter");
let loadingOverlay = document.querySelector("#loadingOverlay");
let currentLocation = document.querySelector("#currentLocation");
let isClicked = false;
let themeCounter = 0;
let counter = 0;

// location-access denied

function locationDenied(error) {
  locationStatus.textContent = `${error}`;

}


// location-access allowed

function locationAllowed() {
  locationStatus.textContent = `Location detected !`;
}

// leaflet-map

const map = L.map("map").setView([20, 0], 2);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(map);


// display latitude and longitude

function latitudeAndLongitude(lat, lon) {
  latitude.textContent = `${lat.toFixed(1)}`;
  longitude.textContent = `${lon.toFixed(1)}`;
}


// user-location detection

locateBtn.addEventListener('click', (e) => {
  loadingOverlay.classList.remove("hidden");
  loadingOverlay.classList.add("flex");

  counter++;
  locationDetection();


})

function locationDetection() {

  if (counter === 1) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        locationAllowed();
        displayLocation(lat, lon);
        latitudeAndLongitude(lat, lon);
        map.setView([lat, lon], 15);

        L.marker([lat, lon]).addTo(map);
        locationDetails.classList.remove("hidden");
        toggleDetails.addEventListener('click', (e) => {
          toggleDetailsShow();
          isClicked = !isClicked;
          if (isClicked)
            toggleDetails.innerHTML = `<i class="fa-solid fa-eye-slash"></i>
            <span>Hide details</span>`;
          else
            toggleDetails.innerHTML = `<i class="fa-solid fa-eye"></i>
            <span>Unhide details</span>`;
        })

      },
      (error) => {
        locationDenied(error.message);
      }
    );
  }
}


// displaying location 

async function displayLocation(lat, lon) {
  let response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`);
  let data = await response.json();
  // console.log(data);
  loadingOverlay.classList.add("hidden");
  loadingOverlay.classList.remove("flex");
  setTimeout(() => {
    locationInfo(data);
  }, 4000);

}


// display location-info 

function locationInfo(data) {
  let address = data.address;
  currentLocation.textContent = `${address.city || address.town || address.village ||
    address.municipality}, ${address.state}, ${address.country}`;
  detailCity.textContent = `${address.city || address.town || address.village ||
    address.municipality || "Not available"}`;

  detailState.textContent = `${address.state || "Not available"}`;
  detailCountry.textContent = `${address.country || "Not available"}`;
  detailCountryCode.textContent = `${address.country_code || "Not available"}`;
  detailPostcode.textContent = `${address.postcode || "Not available"}`;
  detailCounty.textContent = `${address.county || "Not available"}`;
  detailMunicipality.textContent = `${address.municipality || "Not available"}`;
  detailDistrict.textContent = `${address.state_district || "Not available"}`;

  detailDisplayName.textContent = `${data.display_name || "Not available"}`;

  detailAddressType.textContent = `${data.addresstype || "Not available"}`;
  detailCategory.textContent = `${data.category || "Not available"}`;
  detailType.textContent = `${data.type || "Not available"}`;
  detailName.textContent = `${data.name || "Not available"}`;
  detailPlaceRank.textContent = `${data.place_rank ?? "Not available"}`;

}

// hide-unhide details

function toggleDetailsShow() {
  address.classList.toggle("hidden");
  metadata.classList.toggle("hidden");
  locoraFooter.classList.toggle("hidden");
}


// Theme toggling

themeToggle.addEventListener('click', (e) => {
  themeCounter++;
  document.querySelector("html").classList.toggle("dark");
  if (themeCounter % 2 !== 0) {
    themeIcon.classList.remove("fa-moon");
    themeIcon.classList.add("fa-sun");
    theme.textContent = `Light`;
  } else {
    themeIcon.classList.add("fa-moon");
    themeIcon.classList.remove("fa-sun");
    theme.textContent = `Dark`;
  }

})