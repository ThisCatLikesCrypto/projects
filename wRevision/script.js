//!TODO (order of priority): 
//!Add a spaced repetition component using lastRevised and currentKnowledge
//!Add saving to localStorage
//!Add sets, including topic attribute to improve spaced repetition

const flashcardsContainer = document.getElementById('flashcardsContainer');
const stream = document.getElementById('streamRevise');
const streamContainer = document.getElementById('streamContainer');
const fileInput = document.getElementById('fileInput');
const toggleStudyModeBtn = document.getElementById('togglestudy');
let flashcards = [];
let indexes = [];
let studyMode = false;
var timeInSeconds = 0;

function updTime(){
    timeInSeconds = Date.now() / 1000;
    console.log("Time has been updated as " + timeInSeconds);
}

function addCard(){
    const question = prompt('Enter question:');
    const answer = prompt('Enter answer:');
    let lastRevised = timeInSeconds;
    let currentKnowledge = 1;

    if (question && answer) {
        const card = { question, answer, lastRevised, currentKnowledge };
        flashcards.push(card);
        renderFlashcards();
    }
}

function exportCards(){
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(flashcards));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'flashcards.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
}


function toggleStudy(){
    studyMode = !studyMode;
    toggleStudyModeBtn.textContent = studyMode ? 'Edit Mode' : 'Study Mode';
    if (studyMode) {
        renderStudyMode();
    } else {
        renderFlashcards();
    }
}

function streamStudy() {
    document.getElementById('main').style.display = 'none';
    document.getElementById('streamRevise').style.display = 'block';
    renderStudyMode(true);
}

function checkAll() {
    console.log(flashcards);
    flashcards.forEach((index) => {
        checkAnswer(index);
    })
}

function renderFlashcards() {
    flashcardsContainer.innerHTML = '';
    flashcards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <p><strong>Question:</strong> ${card.question}</p>
            <p><strong>Answer:</strong> ${card.answer}</p>
            <button onclick="deleteCard(${index})">Delete</button>
        `;
        flashcardsContainer.appendChild(cardDiv);
    });
}

function deleteCard(index) {
    flashcards.splice(index, 1);
    if (studyMode) {
        renderStudyMode();
    } else {
        renderFlashcards();
    }
}

function renderStudyMode(streamMode=false) {
    streamContainer.innerHTML = '';
    flashcardsContainer.innerHTML = '';
    flashcards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        if (streamMode){
            cardDiv.innerHTML = `
                <p><strong>Question:</strong> ${card.question}</p>
                <input class="wws-inputBox" type="text" id="answer${index}" placeholder="Type your answer">
            `;
        } else {
            cardDiv.innerHTML = `
            <p><strong>Question:</strong> ${card.question}</p>
            <input class="wws-inputBox" type="text" id="answer${index}" placeholder="Type your answer">
            <button onclick="checkAnswer(${index})">Check Answer</button>
        `;
        }
        if (streamMode) {
            stream.appendChild(cardDiv);
        } else {
            flashcardsContainer.appendChild(cardDiv);
        }
    });
}

function checkAnswer(index) {
    const userAnswer = document.getElementById(`answer${index}`).value.trim().toLowerCase();
    let card = flashcards[index];
    const correctAnswer = card.answer.trim().toLowerCase();
    if (userAnswer === correctAnswer) {
        alert('Correct!');
        card.currentKnowledge = card.currentKnowledge*1.25;
    } else {
        alert('Incorrect. The correct answer is: ' + flashcards[index].answer);
        card.currentKnowledge = card.currentKnowledge*0.9;
    }
    card.lastRevised = timeInSeconds;
    console.log("Flashcard " + card.question + " revised.");
    console.log("Current level of knowledge is " + card.currentKnowledge);
}


//Stolen from wTextitor
function upSave(){
    console.log("upSave requested");
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (readerEvent) => {
        var content = readerEvent.target.result;
        var data = JSON.parse(content);
        console.log(data);
            try {
                flashcards = flashcards.concat(data);
                renderFlashcards();
            } catch (error) {
                alert('Error importing flashcards. Please make sure the file is in valid JSON format.');
            }
        };
      }
    try {
        input.click();
        console.log("load success!");
    } catch(error) {
        console.log("fuck you :D " + error);
        alert("There was an error. Please check console if you can be bothered.");
    }
}

document.addEventListener('DOMContentLoaded', function(){
    updTime();
});

setInterval(updTime, 30000);