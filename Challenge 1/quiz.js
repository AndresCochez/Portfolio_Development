const questions = [
    {
        question: "In welke stad studeert de maker van dit portfolio?",
        answer: "Mechelen"
    },
    {
        question: "Welke richting volgt de maker van dit portfolio?",
        answer: "Digital Experience Design"
    },
];

let currentQuestionIndex = 0;
let recognition;

document.getElementById('start-btn').addEventListener('click', startQuiz);

function startQuiz() {
    document.getElementById('start-btn').style.display = 'none';
    askQuestion();
}

function askQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex].question;
        document.getElementById('question').innerText = question;
        document.getElementById('feedback').innerText = '';
        speak(question);
    } else {
        document.getElementById('question').innerText = "De quiz is afgelopen!";
        document.getElementById('feedback').innerText = '';
        speak("De quiz is afgelopen!");
    }
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'nl-NL';
    utterance.onend = () => {
        if (currentQuestionIndex < questions.length) {
            startRecognition();
        }
    };
    speechSynthesis.speak(utterance);
}

function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'nl-NL';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Herkennde spraak:', speechResult);
        checkAnswer(speechResult);
    };

    recognition.onend = () => {
        
    };
}

function checkAnswer(speechResult) {
    const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase().trim();
    console.log('Gebruiker zei:', speechResult);
    console.log('Juiste antwoord:', correctAnswer);
    if (speechResult === correctAnswer.toLowerCase()) {
        document.getElementById('feedback').innerText = "Correct!";
        speak("Correct!");
        currentQuestionIndex++;
        setTimeout(askQuestion, 1000);
    } else {
        document.getElementById('feedback').innerText = "Probeer het opnieuw.";
        speak("Probeer het opnieuw.");
        setTimeout(startRecognition, 1000);
    }
}