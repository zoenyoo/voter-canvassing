import  { initMap, updateUserPositionOn } from './map.js';
import { initVoterInfoForm, showVoterDataInForm } from './voter-info-form.js';
import { initToast, showToast } from './toast.js';
import { showVotersInList } from './voter-list.js';
import { downloadInventory, loadNotes, saveNotes } from './inventory.js';


const fileInput = document.querySelector('#file-name-filter');
const fileLoadButton = document.querySelector('#load-file');

let voterList = document.querySelector('#voter-list'); 

let app = {
  currentVoter: null,
  notes: null,
};

const loadOverlayEl = document.getElementById('load-overlay');
const map = initMap();
const vlist = [];

function getFile() {
  //Filter based on file name
  const text = fileInput.value;
  const fileName = `data/voters_lists/${text}.csv`;
  fetch(fileName)
  .then(resp => resp.text())
  .then(text => {
    const data = Papa.parse(text, {header: true, dynamicTyping: true, skipEmptyLines: true});
    for (const r of data.data){
      const lnglat = r['TIGER/Line Lng/Lat'].split(',').map(parseFloat);
      map.voterLayer.addLayer(L.circleMarker([lnglat[1],lnglat[0]]));
      vlist.push(r);
    }
    console.log(vlist);
  });
}

fileLoadButton.addEventListener('click', getFile, console.log(vlist)); 
fileLoadButton.addEventListener('click', showVotersInList(vlist, voterList)); 

// Event Handlers (copied from main.js of tree-inventory)

function onInventoryLoadSuccess(data) {
  map.voterLayer.addData(data);
  loadOverlayEl.classList.add('hidden');
}

function onSaveClicked(evt) {
  const note = evt.detail.note;
  const voterId = app.currentVoter.properties['ID Number'];
  app.notes[voterId] = note;

  saveNotes(app.notes);
  showToast('Saved!', 'toast-success');
}

function onVoterSelected(evt) {
  const voter = evt.detail.voter;
  app.currentVoter = voter;

  const voterId = voter.properties['ID Number'];
  const notes = app.notes[voterId] || '';
  showVoterDataInForm(voter, notes);
}

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

function setupInteractionEvents() {
  window.addEventListener('voter-selected', onVoterSelected);
  window.addEventListener('save-clicked', onSaveClicked);
}


initMap(); /* may not need this once getFile is fixed */
initToast();
initVoterInfoForm();
setupGeolocationEvent();
setupInteractionEvents();


window.app = app;
window.voterFileInput = fileInput;
window.voterFileLoadButton = fileLoadButton;
window.voterMap = map;