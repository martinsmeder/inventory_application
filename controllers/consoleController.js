const { body, validationResult } = require("express-validator");
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
exports.console_create_get = (req, res, next) => {
  res.render("console_form", { title: "Create Console" });
};

// Handle Console create on POST.
exports.console_create_post = [
  // Validate and sanitize the name and description fields.
  body("name", "Console name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .notEmpty()
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a console object with escaped and trimmed data.
    const newConsole = new Console({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("console_form", {
        title: "Create Console",
        console_model: newConsole,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Console with the same name already exists.
      const consoleExists = await Console.findOne({
        name: req.body.name,
      }).exec();
      if (consoleExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(consoleExists.url);
      } else {
        await newConsole.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(newConsole.url);
      }
    }
  }),
];

// Display Console delete form on GET.
exports.console_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of console and all their games (in parallel)
  const [consoleModel, allGamesOnConsole] = await Promise.all([
    Console.findById(req.params.id).exec(),
    Game.find({ console_model: req.params.id }, "name description").exec(),
  ]);

  if (consoleModel === null) {
    // No results.
    res.redirect("/consoles");
  }

  // Render using console_delete.pug view
  res.render("console_delete", {
    title: "Delete Console",
    console_model: consoleModel,
    console_games: allGamesOnConsole,
  });
});

// Handle Console delete on POST.
exports.console_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of console and all their games (in parallel)
  const [consoleModel, allGamesOnConsole] = await Promise.all([
    Console.findById(req.params.id).exec(),
    Game.find({ console_model: req.params.id }, "name description").exec(),
  ]);

  if (allGamesOnConsole.length > 0) {
    // Console has games. Render in same way as for GET route.
    res.render("console_delete", {
      title: "Delete Console",
      console_model: consoleModel,
      console_games: allGamesOnConsole,
    });
    return;
  } else {
    // Console has no games. Delete object and redirect to the list of consoles.
    await Console.findByIdAndDelete(req.body.console_modelid);
    res.redirect("/consoles");
  }
});

// Display Console update form on GET.
exports.console_update_get = asyncHandler(async (req, res, next) => {
  // Get console for form.
  const consoleModel = await Console.findById(req.params.id);

  if (consoleModel === null) {
    // No results.
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  // Render using console_form.pug view
  res.render("console_form", {
    title: "Update Console",
    console_model: consoleModel,
  });
});

// Handle Console update on POST.
exports.console_update_post = [
  // Validate and sanitize fields.
  body("name", "Console name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .notEmpty()
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Came object with escaped/trimmed data and old id.
    const newConsole = new Console({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Render using console_form.pug view
      res.render("console_form", {
        title: "Create Console",
        console_model: newConsole,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedConsole = await Console.findByIdAndUpdate(
        req.params.id,
        newConsole,
        {}
      );
      // Redirect to console detail page.
      res.redirect(updatedConsole.url);
    }
  }),
];
