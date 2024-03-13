const { body, validationResult } = require("express-validator");
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
  // Get all consoles, which we can use for adding to our game.
  const allConsoles = await Console.find().sort({ name: 1 }).exec();

  // Render using game_form.pug view
  res.render("game_form", {
    title: "Create Game",
    consoles: allConsoles,
  });
});

exports.game_create_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("console_model.*").escape(),
  body("price", "Price must be a valid number.").isNumeric(),
  body(
    "number_in_stock",
    "Number in stock must be a valid number."
  ).isNumeric(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const game = new Game({
      name: req.body.name,
      description: req.body.description,
      console_model: req.body.console_model,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all consoles for form.
      const allConsoles = await Console.find().sort({ name: 1 }).exec();

      // Render using game_form.pug view
      res.render("game_form", {
        title: "Create Game",
        consoles: allConsoles,
        game: game,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await game.save();
      res.redirect(game.url);
    }
  }),
];

// Display game delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  // Get game details from database
  const game = await Game.findById(req.params.id).exec();

  if (game === null) {
    // No results.
    res.redirect("/games");
  }

  // Render using game_delete.pug view
  res.render("game_delete", {
    title: "Delete Game",
    game: game,
  });
});

// Handle game delete on POST.
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  //Delete object and redirect to the list of consoles.
  await Game.findByIdAndDelete(req.body.gameid);
  res.redirect("/games");
});

// Display game update form on GET.
exports.game_update_get = asyncHandler(async (req, res, next) => {
  // Get game and consoles for form.
  const [game, allConsoles] = await Promise.all([
    Game.findById(req.params.id).populate("console_model").exec(),
    Console.find().sort({ name: 1 }).exec(),
  ]);

  if (game === null) {
    // No results.
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  // Render using game_form.pug view
  res.render("game_form", {
    title: "Update Game",
    consoles: allConsoles,
    game: game,
  });
});

// Handle game update on POST.
exports.game_update_post = [
  // Validate and sanitize fields.
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("console_model.*").escape(),
  body("price", "Price must be a valid number.").isNumeric(),
  body(
    "number_in_stock",
    "Number in stock must be a valid number."
  ).isNumeric(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Game object with escaped/trimmed data and old id.
    const game = new Game({
      name: req.body.name,
      description: req.body.description,
      console_model: req.body.console_model,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all consoles for form.
      const allConsoles = await Console.find().sort({ name: 1 }).exec();

      // Render using game_form.pug view
      res.render("game_form", {
        title: "Create Game",
        consoles: allConsoles,
        game: game,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
      // Redirect to book detail page.
      res.redirect(updatedGame.url);
    }
  }),
];
