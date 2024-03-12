const Console = require("../models/console");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");

// Display list of all Consoles.
exports.console_list = asyncHandler(async (req, res, next) => {
  // Get all consoles from database and sort in ascending order
  const allConsoles = await Console.find().sort({ name: 1 }).exec();

  // Render using console_list.pug view
  res.render("console_list", {
    title: "Console List",
    console_list: allConsoles,
  });
});

// Display detail page for a specific Console.
exports.console_detail = asyncHandler(async (req, res, next) => {
  // Get details about console and all their games from database (in parallel)
  const [consoleModel, allGamesOnConsole] = await Promise.all([
    Console.findById(req.params.id).exec(),
    Game.find({ console_model: req.params.id }, "name description").exec(),
  ]);

  if (consoleModel === null) {
    // No results
    const err = new Error("Console not found");
    err.status = 404;
    return next(err);
  }

  // Render using console_detail.pug view
  res.render("console_detail", {
    title: "Console Detail",
    console_model: consoleModel,
    console_games: allGamesOnConsole,
  });
});

// Display Console create form on GET.
exports.console_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Console create GET");
});

// Handle Console create on POST.
exports.console_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Console create POST");
});

// Display Console delete form on GET.
exports.console_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Console delete GET");
});

// Handle Console delete on POST.
exports.console_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Console delete POST");
});

// Display Console update form on GET.
exports.console_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Console update GET");
});

// Handle Console update on POST.
exports.console_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Console update POST");
});
