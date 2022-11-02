const voterNameEl = document.getElementById('voter-name');
const voterNotesEl = document.getElementById('voter-notes');
const saveVoterNotesEl = document.getElementById('save-voter-notes');

function showVoterDataInForm(voter, notes) {
  const voterName = concat(voter.properties['First Name'] + ' ' + voter.properties['Last Name']);
  voterNameEl.innerHTML = voterName;
  voterNotesEl.value = notes;
}

function onSaveButtonClicked() {
  const note = voterNotesEl.value;
  const saveClickedEvent = new CustomEvent('save-clicked', { detail: { note } });
  window.dispatchEvent(saveClickedEvent);
}

function initVoterInfoForm() {
  saveVoterNotesEl.addEventListener('click', onSaveButtonClicked);
}

export {
  showVoterDataInForm,
  initVoterInfoForm,
};