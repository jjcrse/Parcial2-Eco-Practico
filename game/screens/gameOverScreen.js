import { makeRequest, navigateTo, socket } from "../app.js";

export default function renderGameOverScreen(data) {
  const app = document.getElementById("app");
  
  if (data.isVictory) {
    let rankingHTML = '<div style="margin-top: 2rem; text-align: left;">';
    data.players.forEach((player, index) => {
      rankingHTML += `
        <p style="font-size: 1.2rem; margin: 0.5rem 0;">
          ${index + 1}. ${player.nickname} (${player.score} pts)
        </p>
      `;
    });
    rankingHTML += '</div>';

    app.innerHTML = `
      <div id="game-over">
        <h1>🏆 ¡Tenemos un Ganador! 🏆</h1>
        <h2 id="game-result">${data.message}</h2>
        <h3>Ranking Final:</h3>
        ${rankingHTML}
        <p style="margin-top: 2rem;">El juego se reiniciará automáticamente...</p>
      </div>
    `;
    
    setTimeout(() => {
      navigateTo("/lobby", { nickname: data.nickname, players: [] });
    }, 10000);
  } else {
    app.innerHTML = `
      <div id="game-over">
        <h1>Fin de Ronda</h1>
        <h2 id="game-result">${data.message}</h2>
        <button id="restart-button">Siguiente Ronda</button>
      </div>
    `;

    const restartButton = document.getElementById("restart-button");

    restartButton.addEventListener("click", async () => {
      await makeRequest("/api/game/start", "POST");
    });
  }

  socket.on("startGame", (role) => {
    navigateTo("/game", { nickname: data.nickname, role });
  });

  socket.on("returnToLobby", (lobbyData) => {
    navigateTo("/lobby", { 
      nickname: lobbyData.nickname, 
      players: lobbyData.players 
    });
  });
}