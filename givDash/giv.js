function getComplementaryColour(rgb) {
  // Extract the R, G, and B values from the rgba string
  const rgbValues = rgb.match(/\d+/g).map(Number);
  const r = 255 - rgbValues[0];
  const g = 255 - rgbValues[1];
  const b = 255 - rgbValues[2];
  return `rgb(${r}, ${g}, ${b})`;
}

function displayChart(data){
  if (data['grid'] < 0){
    data['gridout'] = 0-data['grid'];
    data['grid'] = 0;
    console.log(data);
  }

  // Custom colours for each fuel type
  const colours = [
    '#F6A626',                   // Solar - dark yellow
    'rgba(255, 0, 0, 0.6)',      // Grid - red
    'rgba(35, 60, 123, 0.75)',   // Battery - blue
    'rgba(35, 60, 123, 0.75)',   // Battery - blue
    'rgba(0, 255, 0, 0.6)',      // Consumption - green
    'rgba(255, 162, 0, 0.8)'      // Gridout - orange
  ];


  // Calculate complementary colours for hover labels
  const hoverTextcolours = colours.map(colour => getComplementaryColour(colour));
  console.log(hoverTextcolours);

  // Create the pie chart using Plotly
  const dataPlotly = [{
    values: Object.values(data),
    labels: Object.keys(data),
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
        text: 'le chart (shows nothing not sure what i was hoping to achieve)',
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

  Plotly.newPlot('dataChart', dataPlotly, layout);
}

function getAPI(){
  fetch("https://giv.cf.wilburwilliams.uk/giv")
    .then((response) => response.json())
    .then(function(json){
      console.log(json);
      document.getElementById('solar').innerHTML = json['solar'];
      document.getElementById('grid').innerHTML = json['grid'];
      document.getElementById('batt').innerHTML = json['batt'];
      document.getElementById('battperc').innerHTML = json['battperc'];
      document.getElementById('consumption').innerHTML = json['consumption'];
      displayChart(json);
    });
}


document.addEventListener('DOMContentLoaded', getAPI);