function onVoterClicked(evt) {
  console.log(evt);
  const voter = evt.layer.feature;

  const voterSelectedEvent = new CustomEvent('voter-selected', { detail: { voter } });
  window.dispatchEvent(voterSelectedEvent);
}

function initMap() {
  const map = L.map('map', { maxZoom: 22, preferCanvas: true }).setView([39.95, -75.16], 13);
  const mapboxAccount = 'mapbox';
  const mapboxStyle = 'light-v10';
  const mapboxToken = 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2w3ZTh1NTIxMTgxNTQwcGhmODU2NW5kaSJ9.pBPd19nWO-Gt-vTf1pOHBA';
  L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxAccount}/${mapboxStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`, {
      maxZoom: 19,
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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