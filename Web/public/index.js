/* Socket */
/*const socket = io();

const dataEl = document.getElementById("data");

socket.on("serial-data", (msg) => {
  dataEl.textContent += msg + "\n";
});*/

/* Leaflet */
var map = L.map("map").setView([55.757107790110624, 9.420052567154611], 20);

/*L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);*/

const greenIcon = L.icon({
  iconUrl: "marker-icon.png",

  /*iconSize: [38, 95], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [-3, -76],*/ // point from which the popup should open relative to the iconAnchor
});

L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  }
).addTo(map);

L.marker([55.757107790110624, 9.420052567154611], {
  icon: greenIcon,
})
  .addTo(map)
  .bindPopup("Add your runestone!<br> Very very easy or so.")
  .openPopup();

// Add marker on click
map.on("click", function (e) {
  const { lat, lng } = e.latlng;

  // Ask user for the text in a popup
  const userText = prompt("Enter text for this marker:");

  // Only add marker if user entered something
  if (userText) {
    L.marker([lat, lng], {
      icon: greenIcon,
    })
      .addTo(map)
      .bindPopup(
        `<b>${userText}</b><br>Latitude: ${lat.toFixed(
          5
        )}<br>Longitude: ${lng.toFixed(5)}`
      )
      .openPopup();
  }
});
