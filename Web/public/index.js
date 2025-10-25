function RuneConverter(letter) {
  let rune;
  letter = letter.toLowerCase();
  switch (letter) {
    case "a":
    case "æ":
      rune = "ᛅ";
      break;
    case "b":
    case "p":
      rune = "ᛒ";
      break;
    case "c":
    case "s":
    case "z":
      rune = "ᛋ";
      break;
    case "d":
    case "t":
      rune = "ᛏ";
      break;
    case "e":
    case "i":
    case "j":
      rune = "ᛁ";
      break;
    case "f":
      rune = "ᚠ";
      break;
    case "g":
    case "k":
    case "q":
      rune = "ᚴ";
      break;
    case "h":
      rune = "ᚼ";
      break;
    case "l":
      rune = "ᛚ";
      break;
    case "m":
      rune = "ᛙ";
      break;
    case "n":
      rune = "ᚾ";
      break;
    case "o":
    case "u":
    case "v":
    case "w":
    case "y":
    case "ø":
      rune = "ᚢ";
      break;
    case "r":
      rune = "ᚱ";
      break;
    case "x":
      rune = "ᚴᛋ";
      break;
    case "å":
      rune = "ᚭ";
      break;
    default:
      rune = " ";
      console.log("Not a letter");
  }
  return rune;
}

function RuneTransliterator(word) {
  const iterator = word[Symbol.iterator]();
  let theChar = iterator.next();
  let runeWord = "";

  while (!theChar.done) {
    runeWord = runeWord.concat(RuneConverter(theChar.value));
    theChar = iterator.next();
  }
  return runeWord;
}

/* Leaflet */
var map = L.map("map").setView([55.757107790110624, 9.420052567154611], 20);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/*L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  }
).addTo(map);*/

const greenIcon = L.icon({
  iconUrl: "stone.png",

  iconSize: [50, 95], // size of the icon
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

L.marker([55.757107790110624, 9.420052567154611], {
  icon: greenIcon,
})
  .addTo(map)
  .bindPopup("Add your runestone!<br> Very very easy or so.")
  .openPopup();

let g_lat;
let g_lng;

L.marker([55.756568, 9.419600], {
  icon:greenIcon,
})
  .addTo(map)
  .bindPopup("ᚼᛅᚱᛅᛚᛏᚱ ᚴᚢᚾᚢᚴᛦ ᛒᛅᚦ ᚴᛅᚢᚱᚢᛅ ᚴᚢᛒᛚ ᚦᛅᚢᛋᛁ ᛅᚠᛏ ᚴᚢᚱᛘ ᚠᛅᚦᚢᚱ ᛋᛁᚾ ᛅᚢᚴ ᛅᚠᛏ ᚦᚭᚢᚱᚢᛁ \
              ᛘᚢᚦᚢᚱ ᛋᛁᚾᛅ ᛋᛅ ᚼᛅᚱᛅᛚᛏᚱ ᛁᛅᛋ ᛋᚭᛦ ᚢᛅᚾ ᛏᛅᚾᛘᛅᚢᚱᚴ ᛅᛚᛅ ᛅᚢᚴ ᚾᚢᚱᚢᛁᛅᚴ ᛅᚢᚴ ᛏᛅᚾᛁ ᚴᛅᚱᚦᛁ ᚴᚱᛁᛋᛏᚾᚭ")

// Add marker on click
map.on("click", function (e) {
  const { lat, lng } = e.latlng;

  window.webkit?.messageHandlers.test.postMessage(e.latlng);

  // Ask user for the text in a popup
  let tmp = prompt("Enter text for this marker:");

  const userText = RuneTransliterator(tmp);

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

/* Socket */
const socket = io();

socket.on("serial-data", (msg) => {
  console.log(msg);
  const { name, lat, long } = msg;
  L.marker([lat, long], {
    icon: greenIcon,
  })
    .addTo(map)
    .bindPopup(
      `<b>${RuneTransliterator(name)}</b><br>Latitude: ${lat.toFixed(
        5
      )}<br>Longitude: ${long.toFixed(5)}`
    )
    .openPopup();
});
