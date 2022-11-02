import  { initMap, updateUserPositionOn } from './map.js';
import { initVoterInfoForm, showVoterDataInForm } from './voter-info-form.js';
import { initToast, showToast } from './toast.js';

const fileInput = document.querySelector('#file-name-filter');
const fileLoadButton = document.querySelector('#load-file');

let app = {
  currentVoter: null,
  notes: JSON.parse(localStorage.getItem('notes') || '{}'),
};

const loadOverlayEl = document.getElementById('load-overlay');
const map = initMap();

function getFile() {
  //Filter based on file name
  const text = fileInput.value;
  const fileName = `data/voters_lists/${text}.csv`;
  fetch(fileName)
  .then(resp => resp.text())
  .then(text => {
    const data = Papa.parse(text, {header: true, dynamicTyping: true});
    const dat = data["data"];
    /*
    need to do something here to convert the data in a leaflet compatible format (geojson)
    */
    /* for (var i=0 ; i < dat.length ; i++) {
      dat[i]["longitude"] = dat[i]['TIGER/Line Lng/Lat'].substr(0,dat[i]["TIGER/Line Lng/Lat"].indexOf(","))
      dat[i]["latitude"] = dat[i]['TIGER/Line Lng/Lat'].substr(temp0[01]["TIGER/Line Lng/Lat"].indexOf(",")+1,)

    } */
    console.log(dat);

    /*
    var geojsonFormattedLocations = dat.map(function(location) {
      return {
          type: 'Feature',
          geometry: {
          type: 'Point',
              coordinates: [location.longitude, location.latitude]
          },
          properties: {
              location
          }
      };
    });
    */
    map.voterLayer.addData(dat[0o1]['TIGER/Line Lng/Lat']);
    /* loadOverlayEl.classList.add('hidden'); */
  });
}

fileLoadButton.addEventListener('click', getFile); /* should function be getFile? */

function onUserPositionSuccess(pos) {
  updateUserPositionOn(map, pos);
}

function onUserPositionFailure(err) {
  console.log(err);
}

function setupGeolocationEvent() {
  navigator.geolocation.getCurrentPosition(
    onUserPositionSuccess,
    onUserPositionFailure,
  );
}

function onSaveClicked(evt) {
  const note = evt.detail.note;
  const voterId = app.currentVoter.properties['ID Number'];
  app.notes[voterId] = note;

  localStorage.setItem('notes', JSON.stringify(app.notes));
  showToast('Saved!', 'toast-success');
}

function onVoterSelected(evt) {
  const voter = evt.detail.voter;
  app.currentVoter = voter;

  const voterId = voter.properties['ID Number'];
  const notes = app.notes[voterId] || '';
  showVoterDataInForm(voter, notes);
}

function setupInteractionEvents() {
  window.addEventListener('tree-selected', onVoterSelected);
  window.addEventListener('save-clicked', onSaveClicked);
}

/* initMap(); /* may not need this once getFile is fixed */
initToast();
initVoterInfoForm();
setupGeolocationEvent();
setupInteractionEvents();

window.app = app;
window.voterFileInput = fileInput;
window.voterFileLoadButton = fileLoadButton;
window.voterMap = map;