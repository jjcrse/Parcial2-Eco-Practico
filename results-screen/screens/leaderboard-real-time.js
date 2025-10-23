import { navigateTo, socket } from "../app.js";

export default function renderScreen1() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div id="screen1" style="text-align: center;">
      <h2 style="color: #fff; font-size: 2rem; margin-top: 1rem;">Marcador en Tiempo Real</h2>
      <div id="players-list" style="margin-top: 2rem;"></div>
      <button id="reset-button" style="
        margin-top: 2rem;
        padding: 1rem 2.5rem;
        font-size: 1.1rem;
        font-weight: 600;
        color: white;
        background: linear-gradient(135deg, #ff6a88 0%, #ff99ac 100%);
        border: none;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(255, 105, 135, 0.3);
        transition: all 0.3s ease;
      ">
         Reiniciar Juego
      </button>

      <style>
        #reset-button:hover {
          transform: scale(1.08);
          background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
          box-shadow: 0 0 20px rgba(255, 120, 150, 0.6);
        }

        #reset-button:active {
          transform: scale(0.96);
          box-shadow: 0 0 10px rgba(255, 120, 150, 0.4);
        }
      </style>
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
        const response = await fetch("http://localhost:5050/api/game/reset-scores", {
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
