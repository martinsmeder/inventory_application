const express = require("express");
const router = express.Router();

// Require controller modules.
const console_controller = require("../controllers/consoleController");
const game_controller = require("../controllers/gameController");

/// GAME ROUTES ///

// GET catalog home page.
router.get("/", game_controller.index);

// GET request for creating a Game. NOTE This must come before route that displays Game (uses id).
router.get("/game/create", game_controller.game_create_get);

// POST request for creating Game.
router.post("/game/create", game_controller.game_create_post);

// GET request to delete Game.
router.get("/game/:id/delete", game_controller.game_delete_get);

// POST request to delete Game.
router.post("/game/:id/delete", game_controller.game_delete_post);

// GET request to update Game.
router.get("/game/:id/update", game_controller.game_update_get);

// POST request to update Game.
router.post("/game/:id/update", game_controller.game_update_post);

// GET request for one Game.
router.get("/game/:id", game_controller.game_detail);

// GET request for list of all Games.
router.get("/games", game_controller.game_list);

/// CONSOLE ROUTES ///

// GET request for creating a Console. NOTE This must come before route that displays Console (uses id).
router.get("/console/create", console_controller.console_create_get);

// POST request for creating Console.
router.post("/console/create", console_controller.console_create_post);

// GET request to delete Console.
router.get("/console/:id/delete", console_controller.console_delete_get);

// POST request to delete Console.
router.post("/console/:id/delete", console_controller.console_delete_post);

// GET request to update Console.
router.get("/console/:id/update", console_controller.console_update_get);

// POST request to update Console.
router.post("/console/:id/update", console_controller.console_update_post);

// GET request for one Console.
router.get("/console/:id", console_controller.console_detail);

// GET request for list of all Consoles.
router.get("/consoles", console_controller.console_list);

module.exports = router;
