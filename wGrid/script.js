var data = "";

async function getCO2API() {
    const response = await fetch('https://api.carbonintensity.org.uk/intensity');
    const stuff = await response.json();
    console.log(stuff);
    return stuff;
}

function displayData(data) {
    actual = data['actual'];
    forecast = data['forecast'];
    index = data['index'];
    document.getElementById('actual').innerHTML = actual;
    document.getElementById('forecast').innerHTML = forecast;
    document.getElementById('index').innerHTML = index;
}

getCO2API().then(function(result){
    data = result['data'][0]['intensity'];
    console.log(data);
    displayData(data);
});