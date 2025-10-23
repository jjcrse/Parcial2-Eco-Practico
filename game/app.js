import renderHomeScreen from "./screens/homeScreen.js";
import renderLobbyScreen from "./screens/lobbyScreen.js";
import renderGameGround from "./screens/gameGround.js";
import renderGameOverScreen from "./screens/gameOverScreen.js";

// Detectar si estamos en producción (Vercel) o desarrollo (local)
const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5050' 
  : window.location.origin;

const socket = io(BASE_URL, { path: "/real-time" });

function clearScripts() {
  document.getElementById("app").innerHTML = "";
}

let route = { path: "/", data: {} };
renderRoute(route);

function renderRoute(currentRoute) {
  switch (currentRoute?.path) {
    case "/":
      clearScripts();
      renderHomeScreen(currentRoute?.data);
      break;
    case "/lobby":
      clearScripts();
      renderLobbyScreen(currentRoute?.data);
      break;
    case "/game":
      clearScripts();
      renderGameGround(currentRoute?.data);
      break;
    case "/gameOver":
      clearScripts();
      renderGameOverScreen(currentRoute?.data);
      break;
    default:
      const app = document.getElementById("app");
      app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  }
}

function navigateTo(path, data) {
  route = { path, data };
  renderRoute(route);
}

async function makeRequest(url, method, body) {
  try {
    let response = await fetch(`${BASE_URL}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API request failed:", error);
    return { success: false, error: error.message };
  }
}

export { navigateTo, socket, makeRequest };