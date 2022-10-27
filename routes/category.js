const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");

const categoryController = require("../controllers/category");
const isAuth = require("../middleware/is-auth");

// GET categories
router.get("/categories", isAuth, categoryController.getCategories);

// POST a category
router.post(
  "/category",
  isAuth,
  body("category").trim().isLength({ min: 3 }),
  categoryController.createCategory
);

// Update a category
router.put(
  "/category/:categoryId",
  isAuth,
  body("category").trim().isLength({ min: 3 }),
  categoryController.updateCategory
);

// Delete a category
router.delete(
  "/category/:categoryId",
  isAuth,
  categoryController.deleteCategory
);

module.exports = router;
