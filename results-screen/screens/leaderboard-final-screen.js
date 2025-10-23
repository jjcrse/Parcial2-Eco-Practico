import { navigateTo } from "../app.js";

export default function renderScreen2(data) {
  const app = document.getElementById("app");
  
  let currentSortMode = "score"; 
  
  function renderPlayersList() {
    let players = [];
    
    if (currentSortMode === "score") {
      players = data.players;
    } else {
      players = [...data.players].sort((a, b) => 
        a.nickname.localeCompare(b.nickname, 'es', { sensitivity: 'base' })
      );
    }

    let html = '<div style="text-align: left; max-width: 600px; margin: 2rem auto 0;">';
    players.forEach((player, index) => {
      let position;
      if (currentSortMode === "score") {
        position = index + 1;
      } else {
        position = "📝";
      }
      
      const medal = currentSortMode === "score" && index === 0 ? '🏆' : 
                    currentSortMode === "score" && index === 1 ? '🥈' : 
                    currentSortMode === "score" && index === 2 ? '🥉' : '';
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

    return html;
  }

  function render() {
    const sortButtonText = currentSortMode === "score" 
      ? " Ordenar Alfabéticamente" 
      : " Ordenar por Puntuación";

    app.innerHTML = `
      <div id="screen2">
        <h2> ¡Fin del Juego! </h2>
        <h3 style="color: #fbbf24; font-size: 2rem; margin: 1rem 0;">
          ¡${data.winner} ha ganado!
        </h3>
        <p style="font-size: 1.1rem; margin-top: 1rem;">Ranking Final:</p>
        <div id="players-ranking">
          ${renderPlayersList()}
        </div>
        <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button id="sort-button">
            ${sortButtonText}
          </button>
          <button id="go-screen-back">
             Volver al Marcador
          </button>
        </div>
      </div>
    `;

    const goBackButton = document.getElementById("go-screen-back");
    const sortButton = document.getElementById("sort-button");

    goBackButton.addEventListener("click", () => {
      navigateTo("/");
    });

    sortButton.addEventListener("click", () => {
      currentSortMode = currentSortMode === "score" ? "alphabetic" : "score";
      render();
    });
  }

  render();
}