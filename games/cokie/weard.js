var cokcl = 0;
var cursorAmount = 0;
var procursorAmount = 0;
var farmamount = 0;
var msg = "";
var cookiesGainedByClicking = 1;
var priceocur = 5;
var priceoprocur = 10;
var priceofarm = 1000;

function saveCookie(name, saveString) {
  // Set the cookie with a 10-year expiration
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 10);
  expires = "expires=" + expirationDate.toUTCString();
  stringToCookie = name + "=" + saveString + ";" + expires + ";path=/";
  document.cookie = stringToCookie;
}

function readCookie(cookieName) {
  const cookies = document.cookie.split(';');
  console.log(cookies)
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return null; // Cookie not found
}

const writeToTextFile = (text, fileName) => {
  let textFile = null;
  const makeTextFile = (text) => {
    const data = new Blob ([text], { type: 'text/plain', });
    if (textFile !== null) {
      window.URL.revokeObjectURL (textFile);
    }
    textFile = window.URL.createObjectURL (data);
    return textFile;
  };
  const link = document.createElement ('a');
  link.setAttribute ('download', fileName);
  link.href = makeTextFile (text);
  link.click();
};


// Encodes Saves
function encodeV001() {
  const header = "cokclv001";
  let saveString = header + "-" + "AA" + cokcl + "AB" + cookiesGainedByClicking + "BA" + cursorAmount + "BB" + procursorAmount + "BC" + farmamount;
  return saveString;
}

// Decodes Saves
function decodeV001(saveString) {
  console.log("Decoding with " + saveString);

  if (saveString.split("-")[0] === "cokclv001") {
      saveString = saveString.substring("cokclv001-".length);
  } else {
      console.log("Save does not start with 'cokclv001', wrong format.");
  }

  cokcl = parseInt(saveString.split("AA")[1].split("AB")[0]);
  cookiesGainedByClicking = parseInt(saveString.split("AB")[1].split("BA")[0]);
  cursorAmount = parseInt(saveString.split("BA")[1].split("BB")[0]);
  procursorAmount = parseInt(saveString.split("BB")[1].split("BC")[0]);
  farmamount = parseInt(saveString.split("BC")[1]);

  console.log(`cokcl: ${cokcl}, cookiesGainedByClicking: ${cookiesGainedByClicking}, cursorAmount: ${cursorAmount}, procursorAmount: ${procursorAmount}, farmamount ${farmamount}.`);
}

// Saves the Game (To a Browser Cookie)
function save() {
  try {
  let saveString = encodeV001();
  saveCookie("cokclSave", saveString);
  console.log("Game Saved with " + saveString)
  } catch(error) {
    console.log("Game failed to save. Please raise an issue on https://github.com/ThisCatLikesCrypto/Website.")
    console.log("Error: " + error.message + ", saveString: " + saveString);
  }
}

// Loads the Game (From a Browser Cookie)
function saveload() {
  try {
  let saveFile = readCookie('cokclSave')
  decodeV001(saveFile);
  console.log("Game Loaded with " + saveFile);
  } catch(error) {
  console.log("Game failed to load. If this is the first load, ignore this. Otherwise please raise an issue on https://github.com/ThisCatLikesCrypto/Website.");
  console.log("Error is " + error.message);
  }
}

function quickRun() {
  if (farmamount > 0) {
    priceofarm=1000*farmamount
    document.getElementById("farmby").innerHTML = priceofarm;
  }
  if (cursorAmount > 0){
    priceocur=5*cursorAmount
    document.getElementById("curby").innerHTML = priceocur;
  }
  if (procursorAmount > 0){
    priceoprocur=10*procursorAmount
    document.getElementById("procurby").innerHTML = priceoprocur;
  }
}

function updateCount() {
  stats = "Du hast: " + cokcl + " cokie(s), " + cursorAmount + " cursor(s), " + procursorAmount + " pro cursor(s), " + farmamount + " farm(s).";
  document.getElementById("counter").innerHTML = stats;
  document.title = Math.round(cokcl) + " cokies - Cokie Cliker";
}

function runner(){
  // Update Counter
  cokcl += 0.5 * cursorAmount;
  cokcl += 1 * procursorAmount;
  cokcl += 10 * farmamount
  updateCount();

  // Update Message
  if (cokcl > 100000) {
    msg = "International expansion, you have taken over all cokie production in the world."
  } else if (cokcl > 10000) {
    msg = "Huge monopoly, you bought out all the cokie businesses in your country and are the only cokie company left";
  } else if (cokcl > 1000) {
    msg = "Massive corporation, the county enjoys your cokies";
  } else if (cokcl > 100) {
    msg = "Local enterprise, you have many happy customers";
  } else if (cokcl > 10) {
    msg = "Beginner business: Supplying stuff for the local female trooper group";
  } else {
    msg = "Your business just begun, have fun!";
  }
  document.getElementById("messages").innerHTML = msg;

  // Save
  save();
  // Update Prices of Items
  quickRun();
}

function cookieClicked() {
  cokcl += cookiesGainedByClicking;
  updateCount();
}

function buyProCursor() {
  if (cokcl > priceoprocur) {
    cokcl -= priceoprocur;
    procursorAmount += 1;
  }
  quickRun()
}

function buyCursor() {
  if (cokcl > priceocur) {
    cursorAmount += 1;
    cokcl -= priceocur;
  }
  quickRun()
}
function buyfarm() {
  if (cokcl > priceofarm) {
    farmamount += 1;
    cokcl -= priceofarm;
  }
  quickRun()
}


// Downloads Save
function downloadSave() {
  let saveString = encodeV001();
  writeToTextFile(saveString, "Cokie Cliker Save")
}

// Uploads Save
function uploadSave() {
  var input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e) => {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (readerEvent) => {
        var content = readerEvent.target.result;
        decodeV001(content);
        runner();
    };
};
input.click();

}

saveload();

setInterval(runner, 1000)