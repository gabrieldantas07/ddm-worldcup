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
        result: mode === "manual" ? null : `${Math.floor(Math.random() * 4)}x${Math.floor(Math.random() * 4)}`,
        penalties: null // Novo campo para guardar o resultado dos pênaltis
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
  
  function simulateGames() {
    matches.forEach((match, index) => {
      const result = `${Math.floor(Math.random() * 4)}x${Math.floor(Math.random() * 4)}`;
      match.result = result;
  
      // Verifica empate e simula pênaltis
      const [score1, score2] = result.split("x").map(Number);
      if (score1 === score2) {
        const winner = simulatePenalties(match);
        match.penalties = winner.penalties;
        match.result += ` (p. ${match.penalties})`; // Adiciona o resultado dos pênaltis ao placar
      }
  
      // Atualiza o placar na interface
      document.getElementById(`result-${index}`).textContent = match.result;
    });
  }
  
  function simulatePenalties(match) {
    let penalties1, penalties2;
    do {
      penalties1 = Math.floor(Math.random() * 6); // Penalidades aleatórias (0 a 5)
      penalties2 = Math.floor(Math.random() * 6);
    } while (penalties1 === penalties2); // Garante que não haverá empate nos pênaltis
  
    match.penalties = `${penalties1}x${penalties2}`;
    return penalties1 > penalties2 ? { team: match.team1, penalties: match.penalties } : { team: match.team2, penalties: match.penalties };
  }
  
  function advanceStage() {
    results.push(...matches);
    teams.length = 0; // Reseta os times para a próxima fase
    matches.forEach(match => {
      const [score1, score2] = match.result.split("x").map(Number);
      if (score1 === score2) {
        // Empate: simula pênaltis
        const winner = simulatePenalties(match);
        teams.push(winner.team);
      } else {
        // Vitória no tempo regular
        teams.push(score1 > score2 ? match.team1 : match.team2);
      }
    });
  
    if (currentStage === "oitavas") {
      currentStage = "quartas";
    } else if (currentStage === "quartas") {
      currentStage = "semis";
    } else if (currentStage === "semis") {
      currentStage = "final";
    } else {
      const [score1, score2] = matches[0].result.split("x").map(Number);
      const winner = score1 === score2 ? simulatePenalties(matches[0]).team : (score1 > score2 ? matches[0].team1 : matches[0].team2);
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
  