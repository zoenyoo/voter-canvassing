
function initializeVoterMap(){
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

 // Function should map all the points we just pulled
function showVotersOnMap(VotersToShow, map) {
    if (map.voterLayers !== undefined) {
        map.removeLayer(map.voterLayers);
    }
    const voterFeatureCollection = {
        "type": "FeatureCollection",
        "features": VotersToShow.map(makeVoterFeature),
    };

    map.voterLayers = L.geoJSON(voterFeatureCollection, {
        pointToLayer: (geoJsonPoint, latlng) => L.circleMarker(latlng),
        style:{
            stroke: null,
            fillOpacity: 0.9,
            radius: 3,
        },
    })
    .bindTooltip(layer => layer.feature.properties['First_name'])
    .addTo(map);
}