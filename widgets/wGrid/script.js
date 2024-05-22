let gendata = {};

async function getCO2API() {
    try {
        const response = await fetch('https://api.carbonintensity.org.uk/intensity');
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function get() {
    try {
        const headers = { 'Accept': 'application/json' };
        const response = await fetch('https://api.carbonintensity.org.uk/generation', { method: 'GET', headers: headers });
        const data = await response.json();
        console.log(data.data);
        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function getLowCarbonPercent(generationMap){
    return Math.round(generationMap['biomass'] + generationMap['nuclear'] + generationMap['hydro'] + generationMap['solar'] + generationMap['wind']);
}

function displayCO2Data(data) {
    const actual = data['actual'];
    const forecast = data['forecast'];
    const index = data['index'];
    if (data[actual]) {
        document.getElementById('actual').innerHTML = actual;
    } else {
        document.getElementById('actual').innerHTML = forecast;
    }
    document.getElementById('index').innerHTML = index;
}

function displayGenData(data) {
    const generationMix = data['generationmix'];

    // Map generation mix data to their respective fuel types
    const generationMap = {};
    generationMix.forEach(entry => {
        generationMap[entry['fuel']] = entry['perc'];
    });

    let lcperc = getLowCarbonPercent(generationMap);
    document.getElementById('lcpercent').innerHTML = lcperc;
}

async function main() {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('theme');
    if (mode==="light") {
        document.getElementById('them').href = "wGrid/light.css";
    } else if (mode==="dark") {
        document.getElementById('them').href = "wGrid/style.css";
    } else {
        document.getElementById('them').href = "wGrid/dumb.css";
        document.getElementById('header').innerHTML = "PLEASE SPECIFY A THEME (?theme=dark or ?theme=light)";
    }
    const co2Data = await getCO2API();
    if (co2Data) {
        displayCO2Data(co2Data['data'][0]['intensity']);
    }
    generationData = await get();
    displayGenData(generationData);
}

document.addEventListener('DOMContentLoaded', main);