const { validationResult } = require("express-validator/check");

const Category = require("../models/category");
const Note = require("../models/note");

exports.getCategories = async (req, res, next) => {
  // Only get categories belonging to the logged in user
  try {
    const categories = await Category.find({ creator: req.userId });
    res
      .status(200)
      .json({ message: "Categories found", categories: categories });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed! The data you entered is invalid"
      );
      error.statusCode = 422;
      throw error;
    }

    const categoryName = req.body.category;
    const category = await Category.find({
      creator: req.userId,
      name: categoryName,
    });

    // Check if category name already exists for the logged in user
    if (category.length !== 0) {
      const error = new Error(
        "Category name already taken. Choose another one."
      );
      error.statusCode = 422;
      throw error;
    }

    //Proceed with creation of the category if there is no duplicates
    const categoryObj = new Category({
      name: categoryName,
      creator: req.userId,
    });

    const result = await categoryObj.save();

    res.status(201).json({
      message: "Category created successfully",
      category: result,
    });
    //
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error(
        "Validation failed! The data you entered is invalid"
      );
      error.statusCode = 422;
      throw error;
    }
    const categoryId = req.params.categoryId;
    const categoryName = req.body.category;

    let category = await Category.findOne({
      creator: req.userId,
      name: categoryName,
    });

    // Check if category name already exists for the logged in user
    if (category) {
      const error = new Error(
        "Category name already taken. Choose another one."
      );
      error.statusCode = 422;
      throw error;
    }

    category = await Category.findOne({ _id: categoryId });
    if (!category) {
      const error = new Error("Could not find category");
      error.statusCode = 404;
      throw error;
    }

    if (category.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    category.name = categoryName;
    const result = await category.save();

    res.status(200).json({ message: "Category updated", category: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      const error = new Error("Could not find category");
      error.statusCode = 404;
      throw error;
    }
    if (category.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized!");
      error.statusCode = 403;
      throw error;
    }

    // Cannot delete category if at least 1 note is linked to it
    const note = await Note.findOne({ category: categoryId });
    if (note) {
      console.log(note);
      const error = new Error(
        "Failed to delete category. At least 1 note is linked to this category!"
      );
      error.statusCode = 424;
      throw error;
    }
    await Category.deleteOne({ _id: categoryId });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
