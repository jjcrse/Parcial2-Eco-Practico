const { assignRoles } = require("../utils/helpers");

const players = [];

const getAllPlayers = () => {
  return players;
};

const addPlayer = (nickname, socketId) => {
  const newPlayer = { id: socketId, nickname };
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

const getGameData = () => {
  return { players };
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
  getGameData,
  resetGame,
};
