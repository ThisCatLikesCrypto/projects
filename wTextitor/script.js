var quill = "justfuckingworkplsplspls"; //Just makes it global, please ignore then content of it

//Sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Copy to clipboard
function clipCopy(stuff) {
    try {
        navigator.clipboard.writeText(stuff);
    } catch(error){
        console.log("Copy of text failed " + error);
    }
}

//Make HTML out of quill
function quilltoHTML(debug=false){
    try {
    alert("No style is included, and equations are funky but other than that i think this works");
    console.log("Converting quill to HTML..");
    ogcontent = quillGetHTML();
    if(debug){
        console.log(ogcontent);
    }
    let substrings = ogcontent.split(/(?=<)/);
    if(debug){
            console.log(substrings);
    }
    for (let i = 0; i < substrings.length; i++) {
        substrings[i] += '\n';
    }
    if(debug){
        console.log(substrings);
    }

    let brrr = substrings.join('')

    //hella replace things (split up so it's not readable but not as bad as if it were one long line)
    brrr = brrr.replace(/class="[^"]*"/g, '');
    brrr = brrr.replace(/ >/g, '>');
    brrr = brrr.replace(/\n<\//g, '</');
    brrr = brrr.replace(/<p>\n<br><\/p>/g, '<br>');
    brrr = brrr.replace(/<p>\n<strong>/g, '<p><strong>');
    brrr = brrr.replace(/ rel="noopener noreferrer" target="_blank"/, '')
    for (let confusion=0; confusion < 11323; confusion++){ //idk why this is necessary but i cba to find a better solution
        brrr = brrr.replace(/<div  data-language="plain">(.*?)<\/div>/, '<code>$1</code>'); 
    }

    //I FUCKING HATE HOW QUILL DOES EQUATIONS LIKE THIS, THIS DOES LIKE NOTHING (I moved on because I have better things to do)
    brrr = brrr.replace(/<span[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/g, '');

    if(debug){
        console.log(brrr);
    }

    output=brrr;

    document.getElementById('convertedhtml').innerText = output;
    document.getElementById('htmlout').style.display = 'block';
    console.log("..success!")
    } catch(error){
        console.log("error "+error);
    }
}

//Count characters, runs at 10times/sec
function countChars() {
    var divContent = document.getElementById('editor').textContent;
    var characterCount = divContent.length;
    document.getElementById('charcount').innerHTML = "&nbsp;&nbsp;Characters: " + characterCount;
}

//Intitate focus mode (get rid of the explanation bit and widen the editor)
function focusMode(){
    console.log("Focus mode on");
    document.getElementById("editor").style['width'] = "100%";
    document.getElementById("info").style.display = "none";
    document.getElementById("unfoc").style.display = "block";
    document.getElementById("foc").style.display = "none";
}

function unfocus(){
    console.log("Focus mode off")
    document.getElementById("editor").style['width'] = "70%";
    document.getElementById("info").style.display = "block";
    document.getElementById("foc").style.display = "block";
    document.getElementById("unfoc").style.display = "none";
}

//Save and saveload functions
function save(quill) {
    console.log('Saving changes');
    const data = JSON.stringify(quill.getContents());
    return data;
}


function saveLocal(){
    try {
        stuff = save(quill);
        localStorage.setItem('storedText', stuff);
        console.log("..success!");
    } catch(error) {
        console.log("failed to save to local storage. error: " + error);
    }
}


function dlSave(){
    console.log("dlSave requested");
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
    link.setAttribute ('download', "texteditSaveFile");
    link.href = makeTextFile(save(quill));
    try {
        link.click();
        console.log("successfully downloaded text file");
    } catch(error) {
        console.log("fuck you :D " + error);
    }
}


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
        quill.setContents(data);
      }
    }
    try {
        input.click();
        console.log("load success!");
    } catch(error) {
        console.log("fuck you :D " + error);
    }

}

//Function to get HTML from a quill delta
function quillGetHTML(inputDelta=JSON.parse(localStorage.getItem('storedText'))) {
    console.log("Get Quill HTML");
    try {
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(inputDelta);
        convhtml = tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
        console.log("..success!");
    } catch(error){
        console.log("Quill HTML get failed. " + error);
    }
    return convhtml;
}

//Set quill to an empty string. Just disables all quill functions. Not sure why you need this.
function killQuill(){
    quill = "";
    console.log("quill killed. saving and loading is broken but it probably still works");
}


//Custom handler functions for the video link input (turns it into embedded links)
function getVideoUrl(url) {
    let match =
    url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) || //Yes this is a pain to decipher, I had bing do it
    url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);

    if (match && match.length === 3) {
    return `https://www.youtube.com/embed/${match[2]}?showinfo=0`;
    }

    match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
    if (match) {
        return `https://player.vimeo.com/video/${match[1]}/`;
    }

return "invalid";
}


function videoHandler() {
    console.log("Video embed button triggered");
    let url = prompt("Enter Video URL:"); // Prompt the user for the video URL
    
    if (url) {
        url = getVideoUrl(url); // Convert the URL to an embeddable format
        if (url == "invalid") {
            alert("invalid url provided (needs youtube or vimeo, defaulting to.. well...)");
            url = "https://www.youtube.com/embed/dQw4w9WgXcQ?showinfo=0"
            console.log("invalid url, defaulting to rickroll");
;       }

        let range = quill.getSelection();
        if (url) {
            quill.insertEmbed(range, "video", url); // Insert the video embed
        }
    } else {
        console.log("Invalid video URL provided.");
    }
}


//Essentially the main function, cuz quill needs the page to be loaded first (ik it's not a function)
document.addEventListener('DOMContentLoaded', (event) => {

    //Only init quill after everything has loaded because otherwise it throws an error :shrug:
    console.log("initalise quill");
    const fontSizeArr = ['8px','9px','10px','12px','14px','16px','20px','24px','32px','42px','54px','68px','84px','98px'];
    try {
        var Delta = Quill.import('delta');
        var Size = Quill.import('attributors/style/size');
        Size.whitelist = fontSizeArr;
        Quill.register(Size, true);
        var toolbarOptions = {
            container: [ //All the toolbar shit
            [{ 'font': [] }, { 'size': fontSizeArr }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image', 'video'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }, { 'align': [] }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{'header': 1}, {'header': 2}],
            ['blockquote', 'code-block', 'formula'],
            ['clean']
            ],
            handlers: {
                video: videoHandler
            }
        };

        quill = new Quill('#editor', {
            modules: {
                toolbar: toolbarOptions
            },
        theme: 'snow'
        });

    } catch(error) {
        console.log("quill broke with " + error);
        document.getElementById('infoh1').innerHTML = "quill failed to load.";
        document.getElementById('infop1').innerHTML = "Please refresh the page. If this this issue persists, please create an issue on https://github.com/ThisCatLikesCrypto/Website (not a link)";
        document.getElementById('infop2').innerHTML = "Error is " + error;
        document.getElementById('infop3').innerHTML = "Please remember that this is still in alpha, and all feedback is welcome!";
    }

    console.log("load previous save");
    try {
        data = JSON.parse(localStorage.getItem('storedText'));
        quill.setContents(data);
        console.log("..success!");
        console.log(data);
    } catch(error) {
        console.log("save failed to load. If this is the first load, ignore this. Otherwise create an issue on https://github.com/ThisCatLikesCrypto/Website" + error);
    }

    var change = new Delta();
        quill.on('text-change', function(delta) {
        change = change.compose(delta);
    });

    setInterval(saveLocal, 10000)
    setInterval(countChars, 500);
});