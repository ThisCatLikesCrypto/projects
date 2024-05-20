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
        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayCO2Data(data) {
    const actual = data['actual'];
    const forecast = data['forecast'];
    const index = data['index'];
    document.getElementById('actual').innerHTML = actual;
    document.getElementById('forecast').innerHTML = forecast;
    document.getElementById('index').innerHTML = index;
}

function displayGenData(data) {
    const generationMix = data['generationmix'];

    // Map generation mix data to their respective fuel types
    const generationMap = {};
    generationMix.forEach(entry => {
        generationMap[entry['fuel']] = entry['perc'];
    });

    // Update HTML elements with the generation data
    document.getElementById('biomass').innerHTML = `Biomass: ${generationMap['biomass']}%`;
    document.getElementById('coal').innerHTML = `Coal: ${generationMap['coal']}%`;
    document.getElementById('imports').innerHTML = `Imports: ${generationMap['imports']}%`;
    document.getElementById('gas').innerHTML = `Gas: ${generationMap['gas']}%`;
    document.getElementById('nuclear').innerHTML = `Nuclear: ${generationMap['nuclear']}%`;
    document.getElementById('other').innerHTML = `Other: ${generationMap['other']}%`;
    document.getElementById('hydro').innerHTML = `Hydro: ${generationMap['hydro']}%`;
    document.getElementById('solar').innerHTML = `Solar: ${generationMap['solar']}%`;
    document.getElementById('wind').innerHTML = `Wind: ${generationMap['wind']}%`;

    // Create the pie chart
    const ctx = document.getElementById('generationChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(generationMap),
            datasets: [{
                label: 'Generation Mix',
                data: Object.values(generationMap),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)',
                    'rgba(83, 102, 255, 0.2)',
                    'rgba(178, 255, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                    'rgba(83, 102, 255, 1)',
                    'rgba(178, 255, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

async function main() {
    const co2Data = await getCO2API();
    if (co2Data) {
        displayCO2Data(co2Data['data'][0]['intensity']);
    }
    const generationData = await get();
    console.log(generationData);
    displayGenData(generationData);
}

main();
