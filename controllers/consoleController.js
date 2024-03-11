const Console = require("../models/console");
const asyncHandler = require("express-async-handler");

// Display list of all Consoles.
exports.console_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Console list");
});

// Display detail page for a specific Console.
exports.console_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Console detail: ${req.params.id}`);
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
