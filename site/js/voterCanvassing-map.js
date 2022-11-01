function initializeVoterCanvasMap(){
    let voterCanvassingMap = L.map('school-map').setView([40.0, -75.11], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
    }).addTo(voterCanvassingMap);
    return voterCanvassingMap;
}

export{
    initializeVoterCanvasMap
}