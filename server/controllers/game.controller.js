const playersDb = require("../db/players.db");
const {
  emitEvent,
  emitToSpecificClient,
} = require("../services/socket.service");

const joinGame = async (req, res) => {
  try {
    const { nickname, socketId } = req.body;
    playersDb.addPlayer(nickname, socketId);

    const gameData = playersDb.getGameData();
    emitEvent("userJoined", gameData);
    emitEvent("updateScores", { players: gameData.players });

    res.status(200).json({ success: true, players: gameData.players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const startGame = async (req, res) => {
  try {
    const playersWithRoles = playersDb.assignPlayerRoles();

    playersWithRoles.forEach((player) => {
      emitToSpecificClient(player.id, "startGame", player.role);
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyMarco = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole([
      "polo",
      "polo-especial",
    ]);

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Marco!!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyPolo = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole("marco");

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Polo!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selectPolo = async (req, res) => {
  try {
    const { socketId, poloId } = req.body;

    const myUser = playersDb.findPlayerById(socketId);
    const poloSelected = playersDb.findPlayerById(poloId);
    const allPlayers = playersDb.getAllPlayers();

    let message = "";

    if (poloSelected.role === "polo-especial") {
      playersDb.updatePlayerScore(socketId, 50);
      playersDb.updatePlayerScore(poloId, -10);
      
      message = `El marco ${myUser.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`;
    } else {
      playersDb.updatePlayerScore(socketId, -10);
      const poloEspecial = playersDb.findPlayersByRole("polo-especial")[0];
      if (poloEspecial) {
        playersDb.updatePlayerScore(poloEspecial.id, 10);
      }
      
      message = `El marco ${myUser.nickname} ha perdido`;
    }

    emitEvent("updateScores", { players: allPlayers });

    const winner = playersDb.checkWinner();
    
    if (winner) {
      const sortedPlayers = playersDb.getPlayersByScore();
      allPlayers.forEach((player) => {
        emitToSpecificClient(player.id, "gameWon", {
          winner: winner.nickname,
          players: sortedPlayers,
        });
      });
      
      emitEvent("showFinalScreen", {
        winner: winner.nickname,
        players: sortedPlayers,
      });
    } else {
      allPlayers.forEach((player) => {
        emitToSpecificClient(player.id, "notifyGameOver", {
          message,
        });
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetScores = async (req, res) => {
  try {
    playersDb.resetScores();
    
    const allPlayers = playersDb.getAllPlayers();
    
    emitEvent("scoresReset", { players: allPlayers });
    emitEvent("updateScores", { players: allPlayers });
    
    allPlayers.forEach((player) => {
      emitToSpecificClient(player.id, "returnToLobby", {
        nickname: player.nickname,
        players: allPlayers,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  joinGame,
  startGame,
  notifyMarco,
  notifyPolo,
  selectPolo,
  resetScores,
};