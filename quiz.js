// quiz.js

var quiz = []
var questionNum = 0;
var answerTokenStr = [];

// get quiz body id
var quizBody = document.getElementById("quizBody");

// shuffle list
function shuffleList(list) {
    var newList = [];

    while (list.length > 0) {
        let index = Math.floor(Math.random() * list.length);
        newList.push(list[index]);
        list.splice(index, 1)
    }

    return newList;
}

// get queryString as associative array
function getQSMap() {
    // get qs
    const qs = window.location.search.substring(1);

    // split qs at & symbols
    const qsPairs = qs.split("&").map((str) => {return str.split("=")})

    // qs map
    let qsMap = [];

    for (let i = 0; i < qsPairs.length; i++) {
        qsMap[qsPairs[i][0]] = qsPairs[i][1];
    }

    return qsMap;
}

// load quiz from file
async function loadQuizFromFile() {
    // get QS map
    const qsMap = getQSMap()

    // look up
    if (qsMap["src"]) {
        // look up
        const response = await fetch("./quizzes/" + qsMap["src"] + ".json");
        quiz = await response.json();
        alert("loaded");

        // complete
        startQuiz();
    } else {
        alert("Error - quiz could not be found!");
    }
}

// create rearrange question
function createRearrangeQuestion() {
    var htmlString = "";

    // create indices array
    var indices = [];

    for (let i = 0; i < quiz.questions[questionNum]; i++) {
        indices.push(i);
    }

    // answer tokens
    htmlString += "<div id=\"answerTokens\"></div>";

    // create button list
    var buttonList = shuffleList(indices);

    // create buttons
    for (let i = 0; i < buttonList.length; i++) {
        // add button
        alert("test")
        htmlString += "<button onclick=\"addToken(" + buttonList[i] + ")\">" + quiz.questions[questionNum].answers[buttonList[i]] + "</button>";
    };

    // reset answer token str
    answerTokenStr = [];

    return htmlString;
}

// create text question
function createTextQuestion() {
    var htmlString = "";

    // create buttons
    for (let i = 0; i < quiz.questions[questionNum].answers.length; i++) {
        htmlString += "<input id=\"answer" + i + "\"></input>";
    };

    return htmlString;    
}

// create multichoice question
function createMultichoiceQuestion() {
    var htmlString = "";

    // create button list
    var buttonList = shuffleList(quiz.questions[questionNum].answers[questionNum]);

    // answer function
    let answerFunc = "";

    // create buttons
    for (let i = 0; i < buttonList; i++) {
        if (buttonList[i] == quiz.questions[questionNum].answers[0]) {
            answerFunc = "multichoiceCorrect()";    
        } else {
            answerFunc = "multichoiceIncorrect()";
        };

        htmlString += "<button onclick=\"" + answerFunc + "\">" + quiz.questions[questionNum].answers[i] + "</button><br/>";
    };

    return htmlString;    
}

// create select question
function createSelectQuestion() {
    var htmlString = "";

    // create indices array
    var indices = [];

    for (let i = 0; i < quiz.questions[questionNum]; i++) {
        indices.push(i);
    }

    // create button list
    var buttonList = shuffleList(indices);

    // answer function
    let answerFunc = "";

    // create buttons
    for (let i = 0; i < buttonList; i++) {
        htmlString += "<input id=\"selectAnswer" + buttonList[i] + "\" type=\"checkbox\">" + quiz.questions[questionNum].answers[i] + "</input><br/>";
    };

    return htmlString;  
}

// start question
function startQuestion(num) {
    // set question num
    questionNum = num;

    // set quiz
    var htmlString = "";
    
    htmlString += "<h1>" + quiz.title + "</h1>";

    // add question text
    htmlString += "<h2>" + quiz.questions[questionNum].question + "</h2>";

    // add image
    if (quiz.questions[questionNum].img != "") {
        htmlString += "<img src=\"" + quiz.questions[questionNum].img + "\">";
    }

    // add answer depending on type
    if(quiz.questions[questionNum].type == "rearrange") {
        htmlString += createRearrangeQuestion();    
    } else if (quiz.questions[questionNum].type == "text") {
        htmlString += createTextQuestion();
    } else if (quiz.questions[questionNum].type == "multichoice") {
        htmlString += createMultichoiceQuestion();
    } else if (quiz.questions[questionNum].type == "select") {
        htmlString += createSelectQuestion();
    }

    quizBody.innerHTML = htmlString;
}

// add token
function addToken(num) {
    // add token string
    answerTokenStr.push(quiz.questions[questionNum].answers[num]);

    // render token str
    renderTokenStr();
}

// render token
function renderTokenStr() {
    var htmlString = "";

    for (let i = 0; i < answerTokenStr.length; i++) {
        htmlString += answerTokenStr[i];
    }
}

// start quiz
function startQuiz() {
    // create quiz
    startQuestion(0);
}

loadQuizFromFile();