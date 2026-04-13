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
    ];
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
