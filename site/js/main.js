
let voterCanvassingMap = L.map('voterCanvassing-map').setView([40.0, -75.11], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
}).addTo(voterCanvassingMap);
    
fetch('data/voters_lists/0101.csv')
.then(resp => resp.text())
.then(text => {
    const data = Papa.parse(text, { header: true});
    console.log(data);
    let layer = L.latLng(data, (
        pointToLayer: ()
    ))
});