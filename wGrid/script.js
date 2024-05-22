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

function displayCO2Data(data) {
    const actual = data['actual'];
    const forecast = data['forecast'];
    const index = data['index'];
    if (data[actual]) {
        document.getElementById('actual').innerHTML = actual;
    } else {
        document.getElementById('actual').innerHTML = "No report";
    }
    document.getElementById('forecast').innerHTML = forecast;
    document.getElementById('index').innerHTML = index;
}

function getLowCarbonPercent(generationMap){
    return Math.round(generationMap['biomass'] + generationMap['nuclear'] + generationMap['hydro'] + generationMap['solar'] + generationMap['wind']);
}

function getComplementaryColour(rgb) {
    // Extract the R, G, and B values from the rgba string
    const rgbValues = rgb.match(/\d+/g).map(Number);
    const r = 255 - rgbValues[0];
    const g = 255 - rgbValues[1];
    const b = 255 - rgbValues[2];
    return `rgb(${r}, ${g}, ${b})`;
}


function displayGenData(data) {
    const generationMix = data['generationmix'];

    // Map generation mix data to their respective fuel types
    const generationMap = {};
    generationMix.forEach(entry => {
        generationMap[entry['fuel']] = entry['perc'];
    });

    lcpercent = getLowCarbonPercent(generationMap);

    // Update HTML elements with the generation data
    document.getElementById('lcpercent').innerHTML = `${lcpercent}%`;
    document.getElementById('biomass').innerHTML = `Biomass: ${generationMap['biomass']}%`;
    document.getElementById('coal').innerHTML = `Coal: ${generationMap['coal']}%`;
    document.getElementById('imports').innerHTML = `Imports: ${generationMap['imports']}%`;
    document.getElementById('gas').innerHTML = `Gas: ${generationMap['gas']}%`;
    document.getElementById('nuclear').innerHTML = `Nuclear: ${generationMap['nuclear']}%`;
    document.getElementById('hydro').innerHTML = `Hydro: ${generationMap['hydro']}%`;
    document.getElementById('solar').innerHTML = `Solar: ${generationMap['solar']}%`;
    document.getElementById('wind').innerHTML = `Wind: ${generationMap['wind']}%`;

    // Custom colours for each fuel type
    const colours = [
        'rgba(0, 255, 0, 0.6)',      // Biomass - green
        'rgba(139, 69, 19, 0.6)',    // Coal - brown
        'rgba(128, 0, 128, 0.6)',    // Imports - purple
        'rgba(255, 0, 0, 0.6)',      // Gas - red
        'rgba(255, 165, 0, 0.6)',    // Nuclear - orange
        'rgba(169, 169, 169, 0.6)',  // Other - dark grey
        'rgba(173, 216, 230, 0.6)',  // Hydro - light blue
        '#F6A626',                   // Solar - dark yellow
        'rgba(255, 255, 255, 0.6)'   // Wind - white
    ];

    
    // Calculate complementary colours for hover labels
    const hoverTextcolours = colours.map(colour => getComplementaryColour(colour));
    console.log(hoverTextcolours);

    // Create the pie chart using Plotly
    const dataPlotly = [{
        values: Object.values(generationMap),
        labels: Object.keys(generationMap),
        type: 'pie',
        marker: {
            colors: colours
        },
        textinfo: 'label+percent',
        insidetextfont: {
            color: 'white'
        },
        hoverlabel: {
            font: {
                color: hoverTextcolours
            }
        }
    }];
    
    const layout = {
        autosize: true,
        title: {
            text: 'Generation Mix',
            font: {
                color: 'white'
            }
        },
        paper_bgcolor: 'rgb(46, 41, 41)',
        font: {
            color: 'white'
        },
        margin: {
            b: 150, // Bottom margin
        }
    };

    Plotly.newPlot('generationChart', dataPlotly, layout);
}

async function main() {
    const co2Data = await getCO2API();
    if (co2Data) {
        displayCO2Data(co2Data['data'][0]['intensity']);
    }
    generationData = await get();
    displayGenData(generationData);
}

//Yes you need JS to click links. In fairness, if you visit this without JS the hell are you trying to do?
function goPlaces(place){
    window.location.href=place;
}

document.addEventListener('DOMContentLoaded', main);

window.addEventListener('resize', function(){displayGenData(generationData);});