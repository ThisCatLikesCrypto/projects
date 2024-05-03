const flashcardsContainer = document.getElementById('flashcardsContainer');
const addCardBtn = document.getElementById('addCardBtn');
const exportBtn = document.getElementById('exportBtn');
const fileInput = document.getElementById('fileInput');
const toggleStudyModeBtn = document.getElementById('toggleStudyModeBtn');
let flashcards = [];
let studyMode = false;

addCardBtn.addEventListener('click', () => {
    const question = prompt('Enter question:');
    const answer = prompt('Enter answer:');

    if (question && answer) {
        const card = { question, answer };
        flashcards.push(card);
        renderFlashcards();
    }
});

exportBtn.addEventListener('click', () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(flashcards));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'flashcards.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    document.body.removeChild(downloadAnchorNode);
});


toggleStudyModeBtn.addEventListener('click', () => {
    studyMode = !studyMode;
    toggleStudyModeBtn.textContent = studyMode ? 'Edit Mode' : 'Study Mode';
    if (studyMode) {
        renderStudyMode();
    } else {
        renderFlashcards();
    }
});

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

function renderStudyMode() {
    flashcardsContainer.innerHTML = '';
    flashcards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <p><strong>Question:</strong> ${card.question}</p>
            <input class="wws-inputBox" type="text" id="answer${index}" placeholder="Type your answer">
            <button onclick="checkAnswer(${index})">Check Answer</button>
        `;
        flashcardsContainer.appendChild(cardDiv);
    });
}

function checkAnswer(index) {
    const userAnswer = document.getElementById(`answer${index}`).value.trim().toLowerCase();
    const correctAnswer = flashcards[index].answer.trim().toLowerCase();
    if (userAnswer === correctAnswer) {
        alert('Correct!');
    } else {
        alert('Incorrect. The correct answer is: ' + flashcards[index].answer);
    }
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