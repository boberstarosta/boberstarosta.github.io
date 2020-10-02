let map = null;
let polyline = null;

const fileSelector = document.getElementById('file-selector');

fileSelector.addEventListener('change', event => {
  const fileList = event.target.files;
  console.log('fileList', fileList);
  readFiles(fileList)
});

const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  readFiles(fileList);
});


function initializeMap() {
  let map = L.map('map').setView([30, 0], 3);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYm9iZXJzdGFyb3N0YSIsImEiOiJja2Zyd3QwOTgwc3BmMnFvZnpybWg0c3djIn0.38dmUS7zwr3cWT8nTWCyyA'
  }).addTo(map);
  return map;
}


function readFiles(fileList) {
  document.getElementById('loading-text').style.display = 'block';
  if (polyline) {
    map.removeLayer(polyline);
  }

  const gpxData = [];
  let count = 0;

  for (let file of fileList) {
    const reader = new FileReader();
    reader.onload = event => {
      let gpx = new gpxParser();
      gpx.parse(event.target.result);
      gpxData.push(gpx.tracks[0].points)
      count++;
      if (count === fileList.length) {
        // All files read, update the map.

        if (!map) {
          map = initializeMap();
        }

        polyline = L.polyline(gpxData, {color: 'red'}).addTo(map)
        map.fitBounds(polyline.getBounds());
        document.getElementById('loading-text').style.display = 'none';
      }
    };
    reader.readAsText(file);
  }
};
