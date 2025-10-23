const express = require("express");
const path = require("path");
const { createServer } = require("http");

const playersRouter = require("./server/routes/players.router");
const gameRouter = require("./server/routes/game.router");
const { initSocketInstance } = require("./server/services/socket.service");

const PORT = process.env.PORT || 5050;

const app = express();
const httpServer = createServer(app);

// Middlewares
app.use(express.json());

// CORS para Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Servir archivos estáticos
app.use("/game", express.static(path.join(__dirname, "game")));
app.use("/results", express.static(path.join(__dirname, "results-screen")));

// Routes
app.use("/api", playersRouter);
app.use("/api/game", gameRouter);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Marco Polo Game Server is running!");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Services
initSocketInstance(httpServer);

// Solo iniciar el servidor si no estamos en Vercel
if (process.env.VERCEL !== "1") {
  httpServer.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
}

// Exportar para Vercel
module.exports = app;