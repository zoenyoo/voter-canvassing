import  { initMap, updateUserPositionOn } from './map.js';
import { initVoterInfoForm, showVoterDataInForm } from './voter-info-form.js';
import { initToast, showToast } from './toast.js';
import { showVotersInList } from './voter-list.js';
import { downloadInventory, loadNotes, saveNotesLocal } from './inventory.js';

const fileInput = document.querySelector('#file-name-filter');
const fileLoadButton = document.querySelector('#load-file');
const voterInput = document.querySelector('#voter-id-filter');
const voterLoadButton = document.querySelector('#load-voter');
const saveVoterNotesEl = document.querySelector('#save-voter-notes');
const saveVoterNotesText = document.getElementsByClassName('voter-notes')
const textBox1 = document.querySelector('#voter-notes-1')
const textBox2 = document.querySelector('#voter-notes-2')
const textBox3 = document.querySelector('#voter-notes-3')
//will need a map function to iterate over all the notes.

let app = {
  currentVoter: null,
  note1: {},
  note2: {},
  note3: {},
};

const voterNameEl = document.getElementById('voter-name');
const loadOverlayEl = document.getElementById('load-overlay');
const map = initMap();
const vlist = [];

let voterList = document.querySelector('#voter-list'); 


function getFile() {
  map.voterLayer.clearLayers()
  const text = fileInput.value;
  const fileName = `data/voters_lists/${text}.csv`;
  fetch(fileName)
  .then(resp => resp.text())
  .then(text => {
    const data = Papa.parse(text, {header: true, dynamicTyping: true, skipEmptyLines: true});
    voterList.style.backgroundColor = "white";

    for (const r of data.data){
      if (r['TIGER/Line Lng/Lat'] !== undefined && r['TIGER/Line Lng/Lat'] !== null) {
        const lnglat = r['TIGER/Line Lng/Lat'].split(',').map(parseFloat);
        map.voterLayer.addLayer(L.circleMarker([lnglat[1],lnglat[0]]));
        vlist.push(r);
      }
    }
    console.log(vlist);
    showVotersInList(vlist, voterList);
  });
}


fileLoadButton.addEventListener('click', () => {
  getFile();
  vlist.length = 0;
});

function getList(loc) {
  const text = fileInput.value;
  const fileName = `data/voters_lists/${text}.csv`;
  fetch(fileName)
  .then(resp => resp.text())
  .then(text => {
    const data = Papa.parse(text, {header: true, dynamicTyping: true, skipEmptyLines: true});
    const filteredvList = [];
    voterList.style.backgroundColor = "white";

     for (const r of data.data){
      if (loc === r['TIGER/Line Lng/Lat']) {
        const lnglat = r['TIGER/Line Lng/Lat'].split(',').map(parseFloat);
        const marker = L.circleMarker([lnglat[1],lnglat[0]]).addTo(map);
        marker.setStyle({color: 'green'});
        filteredvList.push(r);
      }
      } 

      showVotersInList(filteredvList, voterList);
      voterList.style.backgroundColor = "#FDFF47";
    });
    showVotersInList(vlist, voterList);
  
}

function onVoterSelected2(evt) {
   const x = evt.layer._latlng.lng;
   const y = evt.layer._latlng.lat;
   const voterLoc = x.toString() + ',' + y.toString();
   console.log(voterLoc);
   getList(voterLoc);
   console.log(evt);    

}

map.voterLayer.addEventListener('click', onVoterSelected2);

function getVoterForm() {
  const text = fileInput.value;
   const Vtext = voterInput.value.toString();
   const fileName = `data/voters_lists/${text}.csv`;
   console.log(Vtext);
   fetch(fileName)
  .then(resp => resp.text())
  .then(text => {
   const data = Papa.parse(text, {header: true, dynamicTyping: true, skipEmptyLines: true});
   for (const r of data.data){
    if (r['ID Number'] === Vtext) {
      const voterName = r['First Name'] + ' ' +  r['Last Name'];
      console.log(voterName);
      voterNameEl.innerHTML = voterName;
      app.currentVoter = Vtext
    };
  }
  showVoterDataInForm()
  console.log(app.currentVoter)
   //show name
   //create unique answer form
  });
}

voterLoadButton.addEventListener('click', () => {
  getVoterForm();
  vlist.length = 0;
});

// Event Handlers (copied from main.js of tree-inventory)

// `onInventoryLoadSuccess` will be called if and when `downloadInventory`
// function completes the download of the tree inventory file successfully (we do not use this function)
function onInventoryLoadSuccess(data) {
  map.voterLayer.addData(data);
  loadOverlayEl.classList.add('hidden');
}


//function onVoterClicked(evt) {
//  console.log(evt)
//  const voter = evt.layer.feature;
//  const votername = app.properties.properties['voter-name']
//  const voterId = app.currentVoter.properties['ID Number'];
//  app.currentVoter = voter
//
//  const voterNameEl = document.getElementsByClassName('');
//  const voterNotesEl = documet.getElementsByClassName('');
//
//  voterNameEl.innerHTML = votername;
//  voterNotesEl.value = app.notes[voterID] || '';
//}

// `onSaveClicked` will be called if and when the save button on the voter info form is clicked.
// not working yet
function onSaveClicked(evt) {
  console.log(evt)
  //const voterNote = Array.from(saveVoterNotesText).map(el => (el.value));
  const voterNote1 = textBox1.value
  const noteString1 = JSON.stringify({voterNote1})
  const voterNote2 = textBox2.value
  const noteString2 = JSON.stringify({voterNote2})
  const voterNote3 = textBox3.value
  const noteString3 = JSON.stringify({voterNote3})
  const voterId = app.currentVoter;
  //const noteString = JSON.stringify({voterNote})
  saveNotesLocal(voterId, noteString1, noteString2, noteString3, app)
  console.log(noteString1);
  console.log(noteString2);
  console.log(noteString3);
  console.log(app);

  //Next Step is to get this to local storage.

 //saveNotes(app.notes);
 // showToast('Saved!', 'toast-success');
}

saveVoterNotesEl.addEventListener('click', onSaveClicked);

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
  window.addEventListener('click', onVoterSelected2);
  window.addEventListener('click', onSaveClicked);
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

