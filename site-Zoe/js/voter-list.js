import { htmlToElement } from './template-tools.js';

function showVotersInList(voterList){
    voterList.innerHTML = '';
    for (const voter of voterList){
        const html = `<li class = "voter-list-item">${voter['']}</li>`;
        const li = htmlToElement(html);
        voterList.append(li);
    }
}

export {
    showVotersInList,
};