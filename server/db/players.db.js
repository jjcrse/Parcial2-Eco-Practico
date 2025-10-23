const { assignRoles } = require("../utils/helpers");

const players = [];

const getAllPlayers = () => {
  return players;
};

const addPlayer = (nickname, socketId) => {
  const newPlayer = { 
    id: socketId, 
    nickname,
    score: 0 
  };
  players.push(newPlayer);
  return newPlayer;
};

const findPlayerById = (socketId) => {
  return players.find((player) => player.id === socketId) || null;
};

const assignPlayerRoles = () => {
  const playersWithRoles = assignRoles(players);
  players.splice(0, players.length, ...playersWithRoles);
  return players;
};

const findPlayersByRole = (role) => {
  if (Array.isArray(role)) {
    return players.filter((player) => role.includes(player.role));
  }
  return players.filter((player) => player.role === role);
};

const updatePlayerScore = (socketId, points) => {
  const player = findPlayerById(socketId);
  if (player) {
    player.score += points;
    return player;
  }
  return null;
};

const getPlayersByScore = () => {
  return [...players].sort((a, b) => b.score - a.score);
};

const getPlayersAlphabetically = () => {
  return [...players].sort((a, b) => 
    a.nickname.localeCompare(b.nickname, 'es', { sensitivity: 'base' })
  );
};

const checkWinner = () => {
  return players.find((player) => player.score >= 100) || null;
};

const getGameData = () => {
  return { players };
};

const resetScores = () => {
  players.forEach((player) => {
    player.score = 0;
    delete player.role;
  });
};

const resetGame = () => {
  players.splice(0, players.length);
};

module.exports = {
  getAllPlayers,
  addPlayer,
  findPlayerById,
  assignPlayerRoles,
  findPlayersByRole,
  updatePlayerScore,
  getPlayersByScore,
  getPlayersAlphabetically,
  checkWinner,
  getGameData,
  resetScores,
  resetGame,
};
