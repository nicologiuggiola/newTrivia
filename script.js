function startTrivia(amount, category, difficulty, type) {
    let triviaCont = document.getElementById('container');
    if (triviaCont) {
        triviaCont.remove();
    }
    let parseAmount = parseInt(amount);
    let httpString = 'https://opentdb.com/api.php?amount=';
    if (isNaN(parseAmount)) {
        httpString = httpString + '10';
    } else if (amount === '0') {
        httpString = httpString + '10';
    } else if (amount > '50') {
        httpString = httpString + '50';
    } else{
        httpString = httpString + amount;
    }

    if (category !== 0) {
        httpString = httpString + "&category=" + category;
    }

    if (difficulty != 0) {
        httpString = httpString + "&difficulty=" + difficulty;
    }

    if (type !== 0) {
        httpString = httpString + "&type=" + type;
    }
    loadTrivia(httpString);
}

function loadTrivia(httpString) {
    fetch(httpString)
        .then(resp => resp.json())
        .then(createTrivias)
        .catch(err => console.log(err));
}

function createTrivias(data) {
    const results = data.results;
    const triviaArray = [];

    for (const res of results) {
        const trivia = new Trivia(res.category, res.type, res.difficulty, res.question, res.correct_answer, res.incorrect_answers);
        triviaArray.push(trivia);
    }

    displayTrivia(triviaArray);
}




function displayTrivia(triviaArray){
    let divContainer = document.createElement('div');
    divContainer.setAttribute('id','container');
    let pointDiv = document.createElement('div');
    pointDiv.setAttribute('id', 'point-div');
    let pointText = document.createElement('p');
    pointText.setAttribute('id', 'point-text');
    pointText.innerText = "FINAL SCORE";
    let pointCounter = document.createElement('p')
    pointCounter.setAttribute('id', 'counter-p')
    pointCounter.innerText = '0';
    let returnUp = document.createElement('div');
    returnUp.setAttribute('id', 'return-text');
    returnUp.innerText = "BACK";
    returnUp.addEventListener('click', topFunction);
    for (const trivia of triviaArray) {
        let liElement = createTriviaListElement(trivia, pointCounter)
        
        divContainer.appendChild(liElement)
        
    }
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(divContainer);
    pointDiv.appendChild(pointText);
    pointDiv.appendChild(pointCounter);
    pointDiv.appendChild(returnUp);
    divContainer.appendChild(pointDiv);
}


function createTriviaListElement(trivia, counter){

    let divTrivia = document.createElement('div');
    divTrivia.setAttribute('id','trivia');


    let span = document.createElement('span');

    span.className += "question-text ";
    span.style.fontWeight = 'bold';

    let question = decodeHtml(trivia.question);

    let textNode = document.createTextNode(question);

    span.appendChild(textNode);
    divTrivia.appendChild(span)

    let answersList = createAnswersList(trivia.getAllAnswers(),divTrivia, trivia, counter)
    

    return answersList;
}

function createAnswersList(answers,div, trivia, counter){
    for (const answ of answers) {
        let buttonAnswer=document.createElement("button");
        buttonAnswer.setAttribute('id', 'bottone');
        buttonAnswer.className = 'bottoni'
        buttonAnswer.innerHTML = answ;
        div.appendChild(buttonAnswer);
        buttonAnswer.addEventListener('click', () => buttonClick(buttonAnswer.innerText, trivia, div, counter, buttonAnswer))
    }


  return div ;
   
}

function buttonClick(answer, trivia, divTrivia, counter, thisButton) {
   let point = trivia.checkAnswer(answer);
   if (point === 0) {
       thisButton.style.backgroundColor = 'red';
   }
   const allButtons =  divTrivia.getElementsByTagName('button');
   for (const button of allButtons) {
       button.style.color = "black";
       button.disabled = true;
       let rightAnswer = trivia.checkAnswer(button.innerText);
       if (rightAnswer === 1) {
        button.style.backgroundColor = 'green';
        }
   }
   let result = parseInt(counter.innerText)
   result = result + point;
   counter.innerText = result;
}




 function decodeHtml(html) {
     let txt = document.createElement("textarea");
     txt.innerHTML = html;
     return txt.value;
}

 function topFunction() {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    });
}
