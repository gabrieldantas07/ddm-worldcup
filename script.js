const teams = [
  "Brasil", "Argentina", "Espanha", "Inglaterra",
  "Holanda", "Portugal", "Alemanha", "França", 
  "Japão", "Coreia do Sul", "Itália", "Senegal",
  "Croácia", "Bélgica", "Uruguai", "México"
];

let currentStage = "oitavas";
let matches = [];
let results = [];

// Seletores
const homeScreen = document.getElementById("home-screen");
const matchScreen = document.getElementById("match-screen");
const finalScreen = document.getElementById("final-screen");
const stageTitle = document.getElementById("stage-title");
const matchesContainer = document.getElementById("matches");
const champion = document.getElementById("champion");

document.getElementById("random-simulation").addEventListener("click", () => {
  startSimulation("random");
});

document.getElementById("manual-simulation").addEventListener("click", () => {
  startSimulation("manual");
});

document.getElementById("simulate-games").addEventListener("click", simulateGames);
document.getElementById("advance").addEventListener("click", advanceStage);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("restart").addEventListener("click", reset);

function startSimulation(mode) {
  homeScreen.classList.add("hidden");
  matchScreen.classList.remove("hidden");
  createMatches(mode);
}

function createMatches(mode) {
  matchesContainer.innerHTML = "";
  matches = [];

  const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
  for (let i = 0; i < shuffledTeams.length; i += 2) {
    const match = {
      team1: shuffledTeams[i],
      team2: shuffledTeams[i + 1],
      result: mode === "manual" ? null : generateResult()
    };
    matches.push(match);

    const matchElement = document.createElement("div");
    matchElement.classList.add("match");
    matchElement.innerHTML = `
      <span>${match.team1}</span>
      <span id="result-${i / 2}">${match.result || "?"}</span>
      <span>${match.team2}</span>
    `;
    matchesContainer.appendChild(matchElement);
  }
  updateStageTitle();
}

function updateStageTitle() {
  stageTitle.textContent = currentStage === "oitavas" ? "Oitavas de Final" :
                           currentStage === "quartas" ? "Quartas de Final" :
                           currentStage === "semis" ? "Semifinal" : "Final da Copa";
}

function generateResult() {
  let score1, score2;
  do {
    score1 = Math.floor(Math.random() * 5);  // Garante que o placar seja entre 0 e 4
    score2 = Math.floor(Math.random() * 5);
  } while (score1 === score2); // Evita empate no placar

  return `${score1}x${score2}`;
}

function simulateGames() {
  matches.forEach((match, index) => {
    const result = generateResult(); // Gera um resultado sem empate
    match.result = result;

    // Atualiza o placar na interface
    document.getElementById(`result-${index}`).textContent = match.result;
  });
}

function advanceStage() {
  results.push(...matches);
  teams.length = 0; // Reseta os times para a próxima fase
  matches.forEach(match => {
    const [score1, score2] = match.result.split("x").map(Number);
    // Seleciona o time vencedor
    teams.push(score1 > score2 ? match.team1 : match.team2);
  });

  if (currentStage === "oitavas") {
    currentStage = "quartas";
  } else if (currentStage === "quartas") {
    currentStage = "semis";
  } else if (currentStage === "semis") {
    currentStage = "final";
  } else {
    const [score1, score2] = matches[0].result.split("x").map(Number);
    const winner = score1 > score2 ? matches[0].team1 : matches[0].team2;
    matchScreen.classList.add("hidden");
    finalScreen.classList.remove("hidden");
    champion.textContent = `CAMPEÃO: ${winner}`;
    return;
  }
  createMatches("random");
}

function reset() {
  currentStage = "oitavas";
  results = [];
  teams.length = 0;
  teams.push(...[
    "Brasil", "Argentina", "Espanha", "Inglaterra",
    "Holanda", "Portugal", "Alemanha", "França", 
    "Japão", "Coreia do Sul", "Itália", "Senegal",
    "Croácia", "Bélgica", "Uruguai", "México"
  ]);
  homeScreen.classList.remove("hidden");
  matchScreen.classList.add("hidden");
  finalScreen.classList.add("hidden");
}
