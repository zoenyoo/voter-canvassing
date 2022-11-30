const voterNameEl = document.getElementById('voter-name');
const voterNotesEl = document.getElementsByClassName('voter-notes');
const saveVoterNotesEl = document.getElementById('save-voter-notes');

//YOU NEED TO FIX THIS FUNCTION MAKE THE NOTES WORK
function showVoterDataInForm(voterId, app) {
  //const note1 = app.note1[voterId] || '';
  //const note2 = app.note2[voterId] || '';
  //const note3 = app.note3[voterId] || '';
  //voterNameEl.innerHTML = voterName;
  //voterNotesEl.value = notes;
}

function onSaveButtonClicked() {
  const note = voterNotesEl.value;
  const saveClickedEvent = new CustomEvent('save-clicked', { detail: { note } });
  window.dispatchEvent(saveClickedEvent); 
  console.log(note)
}

function initVoterInfoForm() {
  saveVoterNotesEl.addEventListener('click', onSaveButtonClicked);
}

export {
  showVoterDataInForm,
  initVoterInfoForm,
};