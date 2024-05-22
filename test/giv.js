document.addEventListener('DOMContentLoaded', function(){
  fetch("https://giv.cf.wilburwilliams.uk/giv")
  .then((response) => response.json())
  .then(function(json){
    console.log(json);
    document.getElementById('solar').innerHTML = json['solar'];
    document.getElementById('grid').innerHTML = json['grid'];
    document.getElementById('batt').innerHTML = json['batt'];
    document.getElementById('battperc').innerHTML = json['battperc'];
    document.getElementById('consumption').innerHTML = json['consumption'];

  });
})


