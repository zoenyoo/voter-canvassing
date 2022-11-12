import  { initMap, updateUserPositionOn } from './map.js';
import { initVoterInfoForm, showVoterDataInForm } from './voter-info-form.js';
import { initToast, showToast } from './toast.js';
import { showVotersInList } from './voter-list.js';
import { downloadInventory, loadNotes, saveNotes } from './inventory.js';

const fileInput = document.querySelector('#file-name-filter');
const fileLoadButton = document.querySelector('#load-file');

let app = {
  currentVoter: null,
  notes: null,
};

const loadOverlayEl = document.getElementById('load-overlay');
const map = initMap();
const vlist = [];

let voterList = document.querySelector('#voter-list'); 
showVotersInList(vlist, voterList);

function getFile() {
  //Filter based on file name
  const text = fileInput.value;
  const fileName = `data/voters_lists/${text}.csv`;
  fetch(fileName)
  .then(resp => resp.text())
  .then(text => {
    const data = Papa.parse(text, {header: true, dynamicTyping: true, skipEmptyLines: true});
    for (const r of data.data){
      if (r['TIGER/Line Lng/Lat'] !== undefined && r['TIGER/Line Lng/Lat'] !== null) {
        const lnglat = r['TIGER/Line Lng/Lat'].split(',').map(parseFloat);
        map.voterLayer.addLayer(L.circleMarker([lnglat[1],lnglat[0]]));
        vlist.push(r);
      }
    }

    console.log(vlist);
  });
}

fileLoadButton.addEventListener('click', () => {
  getFile();
  console.log(vlist);
  showVotersInList(vlist, voterList);
});


// Event Handlers (copied from main.js of tree-inventory)

// `onInventoryLoadSuccess` will be called if and when `downloadInventory`
// function completes the download of the tree inventory file successfully (we do not use this function)
function onInventoryLoadSuccess(data) {
  map.voterLayer.addData(data);
  loadOverlayEl.classList.add('hidden');
}

// `onSaveClicked` will be called if and when the save button on the voter info form is clicked.
// not working yet
function onSaveClicked(evt) {
  const note = evt.detail.note;
  const voterId = app.currentVoter.properties['ID Number'];
  app.notes[voterId] = note;

  saveNotes(app.notes);
  showToast('Saved!', 'toast-success');
}

// `onVoterSelected` will be called if and when the user clicks on a voter on the map.
// not working yet
function onVoterSelected(evt) {
  const voter = evt.detail.voter;
  app.currentVoter = voter;

  const voterId = voter.properties['ID Number'];
  const notes = app.notes[voterId] || '';
  showVoterDataInForm(voter, notes);
}

// **Geolocation** -- `onUserPositionSuccess` will be called by the geolocation
// API if and when the user's position is successfully found
// not working yet
function onUserPositionSuccess(pos) {
  updateUserPositionOn(map, pos);
}
function onUserPositionFailure(err) {
  console.log(err);
}

// Define global interface setup
// -----------------------------
// Most setup function belong in one component or another. However, there is
// always some setup that doesn't belong to any specific component of your
// application. Here we set up events that have cross-component implications,
// for which we have defined handlers above.

function setupGeolocationEvent() {
  navigator.geolocation.getCurrentPosition(
    onUserPositionSuccess,
    onUserPositionFailure,
  );
}

function setupInteractionEvents() {
  window.addEventListener('voter-selected', onVoterSelected);
  window.addEventListener('save-clicked', onSaveClicked);
}

// Initialize the app components and events

initMap(); /* may not need this once getFile is fixed */
initToast();
initVoterInfoForm();
setupGeolocationEvent();

loadNotes(notes => {
  app.notes = notes;
  setupInteractionEvents();
});
// downloadInventory(onInventoryLoadSuccess);


window.app = app;
window.voterFileInput = fileInput;
window.voterFileLoadButton = fileLoadButton;
window.voterMap = map;

