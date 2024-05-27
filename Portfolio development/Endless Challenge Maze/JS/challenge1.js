const questions = [
    {
        question: "Wat is de hoofdstad van Nederland?",
        answer: "Amsterdam"
    },
    {
        question: "Hoeveel dagen heeft een week?",
        answer: "Zeven"
    },
    {
        question: "Wat is de kleur van de lucht op een heldere dag?",
        answer: "Blauw"
    },
    {
        question: "Welke taal spreken ze in Frankrijk?",
        answer: "Frans"
    },
    {
        question: "Wat is twee plus twee?",
        answer: "Vier"
    },
    {
        question: "Wat is het tegenovergestelde van donker?",
        answer: "Licht"
    },
    {
        question: "Hoeveel uren zitten er in een dag?",
        answer: "24"
    },
    {
        question: "Welke maand komt na juni?",
        answer: "Juli"
    },
    {
        question: "Wat is de grootste planeet in ons zonnestelsel?",
        answer: "Mechelen"
    },
    {
        question: "Welk dier zegt 'miauw?",
        answer: "Kat"
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