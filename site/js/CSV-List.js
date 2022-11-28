
function showVotersMap(){}



function makeVoterFeature(){}
fetch('data/voters_lists/0101.csv')
.then(resp => resp.text())
.then(text => {
    const data = Papa.parse(text, { header: true});
    console.log(data);
});