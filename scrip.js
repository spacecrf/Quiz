let xmlDoc = null;
let questions = [];
let currentIndex = 0;
let score = 0;
let timer = 0;
let timerInterval = null;

function loadXML() {
  const lang = document.getElementById("language").value;
  const file = lang === "es" ? "preguntas_es.xml" : "preguntas_en.xml";

  fetch(file)
    .then((response) => {
      if (!response.ok) throw new Error("No se pudo cargar el XML");
      return response.text();
    })
    .then((xmlText) => {
      const parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlText, "text/xml");
      questions = Array.from(xmlDoc.getElementsByTagName("question"));
      currentIndex = 0;
      score = 0;
      timer = 0;
      document.getElementById("points").textContent = score;
      document.getElementById("time").textContent = timer;
      showQuestion();
      startTimer();
    })
    .catch((error) => {
      document.getElementById("question-box").innerHTML = "❌ Error al cargar preguntas.";
      console.error(error);
    });
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    clearInterval(timerInterval);
    document.getElementById("question-box").innerHTML = `<h2>Quiz terminado!</h2><p>Tu puntuación: ${score} / ${questions.length}</p>`;
    return;
  }

  const question = questions[currentIndex];
  const wording = question.getElementsByTagName("wording")[0].textContent;
  const choices = Array.from(question.getElementsByTagName("choice"));

  let html = `<p><strong>${wording}</strong></p><ul>`;
  choices.forEach((choice, i) => {
    html += `<li><button onclick="checkAnswer(${i})">${choice.textContent}</button></li>`;
  });
  html += "</ul>";

  document.getElementById("question-box").innerHTML = html;
}

function checkAnswer(choiceIndex) {
  const question = questions[currentIndex];
  const choices = Array.from(question.getElementsByTagName("choice"));
  const selectedChoice = choices[choiceIndex];

  if (selectedChoice.getAttribute("correct") === "yes") {
    score++;
    document.getElementById("points").textContent = score;
  }

  currentIndex++;
  timer = 0; // reset timer per question
  showQuestion();
}

function nextQuestion() {
  currentIndex++;
  timer = 0;
  showQuestion();
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  document.getElementById("time").textContent = timer;

  timerInterval = setInterval(() => {
    timer++;
    document.getElementById("time").textContent = timer;
  }, 1000);
}

// Cargar preguntas al iniciar la página
window.onload = loadXML;
