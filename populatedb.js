#! /usr/bin/env node
// "Shebang" to ensure that the script will be interpreted using the Node.js interpreter
// Run the script: node populatedb <your MongoDB connection string>

// Get and store command-line arguments passed to the script, excluding the first
// two elements (Node.js executable and script path)
const userArgs = process.argv.slice(2);

// Get models
const Console = require("./models/console");
const Game = require("./models/game");

// Initialize arrays used for ordering items
const consoles = [];
const games = [];

// Import the Mongoose library
const mongoose = require("mongoose");

// Disable strict mode to allow for more flexible queries
mongoose.set("strictQuery", false);

// Retrieve the MongoDB connection string from command-line arguments
const mongoDB = userArgs[0];

// Define the main function
async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB); // Connect to database using connection string
  console.log("Debug: Should be connected?");
  await createConsoles(); // Create consoles
  await createGames(); // Create games
  console.log("Debug: Closing mongoose");
  mongoose.connection.close(); // Close the connection
}

// Define functions for creating consoles and games
async function consoleCreate(index, name, description) {
  const newConsole = new Console({
    name: name,
    description: description,
  });
  await newConsole.save(); // Insert new document
  consoles[index] = newConsole; // Ensure correct order
  console.log(`Added console: ${name}`);
  return newConsole;
}

async function gameCreate(
  index,
  name,
  description,
  console_model,
  price,
  number_in_stock
) {
  const newGame = new Game({
    name: name,
    description: description,
    console_model: console_model,
    price: price,
    number_in_stock: number_in_stock,
  });
  await newGame.save(); // Insert new document
  games[index] = newGame; // Ensure correct order
  console.log(`Added game: ${name}`);
  return newGame;
}

// Call functions to create consoles and games
async function createConsoles() {
  const createdConsoles = await Promise.all([
    consoleCreate(0, "Nintendo 64", "Classic gaming console from the 90s"),
    consoleCreate(
      1,
      "Super Nintendo Entertainment System (SNES)",
      "Iconic 16-bit gaming console"
    ),
    consoleCreate(2, "Sega Genesis", "Popular 16-bit gaming console by Sega"),
  ]);
  return createdConsoles;
}

async function createGames() {
  const nintendo64 = consoles[0];
  const snes = consoles[1];
  const segaGenesis = consoles[2];

  const gamesPromises = [
    // Nintendo 64 Games
    gameCreate(
      0,
      "Super Mario 64",
      "Classic 3D platformer featuring Mario",
      nintendo64,
      49.99,
      30
    ),
    gameCreate(
      1,
      "The Legend of Zelda: Ocarina of Time",
      "Epic action-adventure game with Link",
      nintendo64,
      59.99,
      20
    ),
    gameCreate(
      2,
      "GoldenEye 007",
      "Revolutionary first-person shooter based on the James Bond film",
      nintendo64,
      39.99,
      15
    ),

    // Super Nintendo Entertainment System (SNES) Games
    gameCreate(
      3,
      "Super Mario World",
      "Iconic side-scrolling platformer with Mario",
      snes,
      39.99,
      25
    ),
    gameCreate(
      4,
      "The Legend of Zelda: A Link to the Past",
      "Epic action-adventure with Link in a dark world",
      snes,
      49.99,
      20
    ),
    gameCreate(
      5,
      "Super Metroid",
      "Classic sci-fi action game featuring Samus Aran",
      snes,
      44.99,
      18
    ),

    // Sega Genesis Games
    gameCreate(
      6,
      "Sonic the Hedgehog",
      "High-speed platformer with Sonic",
      segaGenesis,
      34.99,
      30
    ),
    gameCreate(
      7,
      "Streets of Rage",
      "Beat 'em up action game with memorable characters",
      segaGenesis,
      29.99,
      22
    ),
    gameCreate(
      8,
      "Mortal Kombat",
      "Iconic fighting game known for its fatalities",
      segaGenesis,
      39.99,
      18
    ),
  ];

  const createdGames = await Promise.all(gamesPromises);
  return createdGames;
}

// Start the main function
main().catch((err) => console.log(err));
