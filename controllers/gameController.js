const Game = require("../models/game");
const Console = require("../models/console");
const asyncHandler = require("express-async-handler");

// Display home page.
exports.index = asyncHandler(async (req, res, next) => {
  // Get games and consoles from database (in parallel)
  const [numGames, numConsoles] = await Promise.all([
    Game.countDocuments({}).exec(),
    Console.countDocuments({}).exec(),
  ]);

  // Render using index.pug view
  res.render("index", {
    title: "Game Inventory Home",
    game_count: numGames,
    console_count: numConsoles,
  });
});

// Display list of all games.
exports.game_list = asyncHandler(async (req, res, next) => {
  // Get all games and sort them in ascending order
  const allGames = await Game.find({}, "name console_model")
    .sort({ name: 1 })
    .populate("console_model") // Reference document from console_model collection
    .exec();

  // Render using game_list.pug view
  res.render("game_list", { title: "Game List", game_list: allGames });
});

// Display detail page for a specific game.
exports.game_detail = asyncHandler(async (req, res, next) => {
  // Get game details from database
  const game = await Game.findById(req.params.id)
    .populate("console_model") // Reference document from console_model collection
    .exec();

  if (game === null) {
    // No results
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  // Render using game_detail.pug view
  res.render("game_detail", { title: game.name, game: game });
});

// Display game create form on GET.
exports.game_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game create GET");
});

// Handle game create on POST.
exports.game_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game create POST");
});

// Display game delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game delete GET");
});

// Handle game delete on POST.
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game delete POST");
});

// Display game update form on GET.
exports.game_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game update GET");
});

// Handle game update on POST.
exports.game_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Game update POST");
});
