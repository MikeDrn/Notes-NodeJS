const { validationResult } = require("express-validator/check");
const mongoose = require("mongoose");

const Note = require("../models/note");
const User = require("../models/user");
const Category = require("../models/category");

exports.getNotes = async (req, res, next) => {
  const category = req.query.category;
  Note.createIndexes({ creator: req.userId });

  try {
    // Only get notes belonging to the logged in user
    const notes = await Note.find({ creator: req.userId }).sort({
      updatedAt: -1,
    });

    let resultNotes = notes;

    // if category is set to filter the notes
    if (category) {
      resultNotes = [];
      notes.forEach((note) => {
        if (note.category.toString() === category.toString()) {
          resultNotes = [...resultNotes, note];
        }
      });
      // Category does not exist because no documents were added to the resultNotes array
      if (resultNotes.length === 0) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        throw error;
      }
    }

    res.status(200).json({ message: "Notes found", notes: resultNotes });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.searchByTag = async (req, res, next) => {
  const tag = req.params.tag;

  try {
    const notes = await Note.aggregate([
      { $match: { creator: mongoose.Types.ObjectId(req.userId) } },
      { $match: { tags: tag } },
    ]);
    if (!notes) {
      const error = new Error("Could not find note with this tag");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Notes searched by tag found", notes: notes });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createNote = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed! The data you entered is invalid"
      );
      error.statusCode = 422;
      throw error;
    }
    const title = req.body.title;
    const content = req.body.content;

    let tags = req.body.tags;
    if (tags) {
      tags = tags.split(" ");
    } else {
      tags = [];
    }
    // Select category through a select option form, which reflects all categories created by the logged in user
    const category = mongoose.Types.ObjectId(req.body.category);

    const note = new Note({
      title: title,
      content: content,
      tags: tags,
      creator: req.userId,
      category: category,
    });

    await note.save();
    const user = await User.findOne({ _id: req.userId });
    user.notes.push(note);
    await user.save();

    res.status(201).json({
      message: "Note created successfully",
      note: note,
      creator: { _id: user._id },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getNote = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    const note = await Note.findOne({ _id: noteId, creator: req.userId });

    if (!note) {
      const error = new Error("Could not find note");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Note found", note: note });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateNote = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed! The data you entered is invalid"
      );
      error.statusCode = 422;
      throw error;
    }
    const noteId = req.params.noteId;
    const title = req.body.title;
    const content = req.body.content;
    const category = mongoose.Types.ObjectId(req.body.category);
    
    let tags = req.body.tags;
    if (tags) {
      tags = tags.split(" ");
    } else {
      tags = [];
    }

    const note = await Note.findOne({ _id: noteId });

    if (!note) {
      const error = new Error("Could not find note");
      error.statusCode = 404;
      throw error;
    }

    if (note.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    note.title = title;
    note.content = content;
    note.category = category;
    note.tags = tags;

    const result = await note.save();
    res.status(200).json({ message: "Note updated", note: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    const note = await Note.findOne({ _id: noteId });

    if (!note) {
      const error = new Error("Could not find note");
      error.statusCode = 404;
      throw error;
    }
    if (note.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }
    await Note.deleteOne({ _id: noteId });

    // clearing relation user-note
    const user = await User.findOne({ _id: req.userId });
    user.notes.pull(noteId);
    await user.save();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
