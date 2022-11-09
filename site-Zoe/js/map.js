function onVoterClicked(evt) {
  console.log(evt);
  const voter = evt.layer.feature;

  const voterSelectedEvent = new CustomEvent('voter-selected', { detail: { voter } });
  window.dispatchEvent(voterSelectedEvent);
}

function initMap() {
  const map = L.map('map', { maxZoom: 22, preferCanvas: true }).setView([39.95, -75.16], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  map.voterLayer = L.geoJSON(null, {
    pointToLayer: (feature, latlng) => L.circleMarker(latlng),
    style: {
      fillColor: '#83bf15',
      fillOpacity: 0.3,
      stroke: false,
    },
  }).addTo(map);

  map.voterLayer.addEventListener('click', onVoterClicked);

  map.positionLayer = L.geoJSON(null).addTo(map);

  return map;
}

function updateUserPositionOn(map, pos) {
  map.positionLayer.addData({
    'type': 'Point',
    'coordinates': [pos.coords.longitude, pos.coords.latitude],
  });
  map.setView([pos.coords.latitude, pos.coords.longitude], 19);
}

export {
  initMap,
  updateUserPositionOn,
};