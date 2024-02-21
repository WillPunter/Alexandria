// quiz.js

var quiz = []
var questionNum = 0;

// get quiz body id
var bodyId = document.getElementById("quizBody");

// shuffle list
function shuffleList(list) {
    var newList = [];

    while (list.length > 0) {
        let index = Math.floor(Math.random() * list.length);
        newList.push(list[index]);
        list.filter((x) => {x != list[index]})
    }

    return newList;
}

// get queryString as associative array
function getQSMap() {
    // get qs
    const qs = window.location.search.substring(1);

    // split qs at & symbols
    return qs.split("&").map((str) => {return str.split("=")})
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

        // complete
        startQuiz();
    } else {
        alert("Error - quiz could not be found!");
    }
}

// create rearrange question
function createRearrangeQuestion() {
    var htmlString = "";

    // create buttons
    for (let i = 0; i < quiz.questions[questionNum].answers.length; i++) {
        // add button
        htmlString += "<button onclick=\"" + i + "\">" + quiz.questions.answers[i] + "</button>";
    };

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
    var buttonList = shuffleList(quiz.questions.answers[questionNum]);

    // answer function
    let answerFunc = "";

    // create buttons
    for (let i = 0; i < buttonList; i++) {
        if (buttonList[i] == quiz.questions.answers[questionNum]) {
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

    var indices = [];

    for (let i = 0; i < quiz.questions; i++) {
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
    
    // add question text
    htmlString += "<h1>" + quiz.questions[questionNum].question + "</h2>";

    // add image
    if (quiz.questions[questionNum].img != "") {
        htmlString += "<img src=\"" + quiz.questions[questionNum].img + "\">";
    }

    // add answer depending on type
    switch (questions[questionNum].type) {
        case "rearrange":
            createRearrangeQuestion();    
            break;
        
        case "text":
            createTextQuestion();
            break;

        case "multichoice":
            createMultichoiceQuestion();
            break;

        case "select":
            createSelectQuestion();
            break;
    }
}

// 
//function () {

//}

// start quiz
function startQuiz() {
    // create quiz
    startQuestion(0);
}

loadQuizFromFile();