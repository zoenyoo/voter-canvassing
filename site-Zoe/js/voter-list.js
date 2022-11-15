import { htmlToElement } from './template-tools.js';

function showVotersInList(votersToShow, voterList){
    voterList.innerHTML = '';
    for (const voter of votersToShow){
        const html = `<li class = "voter-list-item">${voter['First Name'] + ' ' + voter['Last Name'] + '\n' + voter['TIGER/Line Matched Address']}</li>`;
        const li = htmlToElement(html);
        voterList.append(li);
    }
}

export {
    showVotersInList,
};