import { navigateTo, socket, BASE_URL } from "../app.js";

export default function renderScreen1() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="screen1">
      <h2>🎮 Marcador en Tiempo Real 🎮</h2>
      <div id="players-list" style="margin-top: 2rem;"></div>
      <button id="reset-button" style="margin-top: 2rem; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
        🔄 Reiniciar Juego
      </button>
    </div>
  `;

  const playersList = document.getElementById("players-list");
  const resetButton = document.getElementById("reset-button");

  function updatePlayersList(players) {
    if (!players || players.length === 0) {
      playersList.innerHTML = '<p style="color: #888;">Esperando jugadores...</p>';
      return;
    }

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    let html = '<div style="text-align: left; max-width: 600px; margin: 0 auto;">';
    sortedPlayers.forEach((player, index) => {
      const position = index + 1;
      const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '';
      const scoreColor = player.score >= 0 ? '#4ade80' : '#f87171';
      
      html += `
        <div style="
          background: rgba(30, 30, 45, 0.6);
          padding: 1rem;
          margin: 0.5rem 0;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="font-size: 1.2rem; font-weight: 600;">
            ${medal} ${position}. ${player.nickname}
          </span>
          <span style="font-size: 1.3rem; font-weight: 700; color: ${scoreColor};">
            ${player.score} pts
          </span>
        </div>
      `;
    });
    html += '</div>';

    playersList.innerHTML = html;
  }

  socket.on("userJoined", (data) => {
    updatePlayersList(data.players);
  });

  socket.on("updateScores", (data) => {
    updatePlayersList(data.players);
  });

  socket.on("showFinalScreen", (data) => {
    navigateTo("/screen2", data);
  });

  socket.on("scoresReset", (data) => {
    updatePlayersList(data.players);
  });

  resetButton.addEventListener("click", async () => {
    if (confirm("¿Estás seguro de que quieres reiniciar el juego y limpiar todas las puntuaciones?")) {
      try {
        const response = await fetch(`${BASE_URL}/api/game/reset-scores`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al reiniciar el juego");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al reiniciar el juego");
      }
    }
  });
}