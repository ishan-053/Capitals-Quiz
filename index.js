import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

let quiz = [];
let totalCorrect = 0;
let currentQuestion = {};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function loadQuizData() {
  try {
    await db.connect();
    const result = await db.query("SELECT * FROM capitals");
    quiz = result.rows;
  } catch (err) {
    console.error(err.stack);
  }
}

function nextQuestion() {
  const randomIndex = Math.floor(Math.random() * quiz.length);
  currentQuestion = quiz[randomIndex];
}

app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
  });
});

app.post("/submit", (req, res) => {
  const answer = req.body.answer.trim();
  let isCorrect = false;

  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function startServer() {
  await loadQuizData();

  if (quiz.length === 0) {
    quiz = [
      { country: "France", capital: "Paris" },
      { country: "United Kingdom", capital: "London" },
      { country: "United States of America", capital: "Washington, D.C." },
      [
  { country: "France", capital: "Paris" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States of America", capital: "Washington, D.C." },
  { country: "India", capital: "New Delhi" },
  { country: "Germany", capital: "Berlin" },
  { country: "Italy", capital: "Rome" },
  { country: "Spain", capital: "Madrid" },
  { country: "Canada", capital: "Ottawa" },
  { country: "Australia", capital: "Canberra" },
  { country: "Japan", capital: "Tokyo" },
  { country: "China", capital: "Beijing" },
  { country: "Russia", capital: "Moscow" },
  { country: "Brazil", capital: "Brasília" },
  { country: "South Africa", capital: "Pretoria" },
  { country: "Mexico", capital: "Mexico City" },
  { country: "Argentina", capital: "Buenos Aires" },
  { country: "Egypt", capital: "Cairo" },
  { country: "Turkey", capital: "Ankara" },
  { country: "Saudi Arabia", capital: "Riyadh" },
  { country: "South Korea", capital: "Seoul" },
  { country: "Indonesia", capital: "Jakarta" },
  { country: "Thailand", capital: "Bangkok" },
  { country: "Vietnam", capital: "Hanoi" },
  { country: "Pakistan", capital: "Islamabad" },
  { country: "Bangladesh", capital: "Dhaka" },
  { country: "Sri Lanka", capital: "Sri Jayawardenepura Kotte" },
  { country: "Nepal", capital: "Kathmandu" },
  { country: "Netherlands", capital: "Amsterdam" },
  { country: "Switzerland", capital: "Bern" },
  { country: "Sweden", capital: "Stockholm" },
  { country: "Norway", capital: "Oslo" },
  { country: "Denmark", capital: "Copenhagen" },
  { country: "Finland", capital: "Helsinki" },
  { country: "Poland", capital: "Warsaw" },
  { country: "Greece", capital: "Athens" },
  { country: "Portugal", capital: "Lisbon" },
  { country: "Ireland", capital: "Dublin" },
  { country: "New Zealand", capital: "Wellington" }
]
    ];
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
