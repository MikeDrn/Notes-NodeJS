const express = require("express");
const { body } = require("express-validator/check");

const notesController = require("../controllers/notes");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET /notes
router.get("/notes", isAuth, notesController.getNotes);

// GET /notes/:tag
router.get("/notes/:tag", isAuth, notesController.searchByTag);

// POST /note
router.post(
  "/note",
  isAuth,
  [body("title").trim().isLength({ min: 5 }), body("content").trim()],
  notesController.createNote
);

// GET a single note
router.get("/note/:noteId", isAuth, notesController.getNote);

// Update a note
router.put(
  "/note/:noteId",
  isAuth,
  [body("title").trim().isLength({ min: 5 }), body("content").trim()],
  notesController.updateNote
);

// Delete a note
router.delete("/note/:noteId", isAuth, notesController.deleteNote);

module.exports = router;
