import { htmlToElement } from './template-tools.js';

function showVotersInList(voterList){
    schoolList.innerHTML = '';
    for (const voter of voterList){
        const html = `<li class = "voter-list-item">${voter['']}</li>`;
        const li = htmlToElement(html);
        schoolList.append(li);
    }
}

export {
    showVotersInList,
};