const express = require("express");
const {
  categoryControlller,
  createCategoryController,
  deleteCategoryCOntroller,
  singleCategoryController,
  updateCategoryController,
  deleteManyCategoryController
} = require("./../controllers/categoryController.js");
const { requireSignIn, isSuperAdmin } = require("../middlewares/adminMiddleware.js");

const router = express.Router();

//routes
// create category
router.post("/create-category",requireSignIn,isSuperAdmin, createCategoryController);

//update category
router.post("/update-category/:id",requireSignIn,isSuperAdmin, updateCategoryController);

//getALl category
router.get("/get-category", categoryControlller);

//single category
router.get("/single-category/:slug", singleCategoryController);

//delete category
router.delete("/delete-category/:id",requireSignIn,isSuperAdmin, deleteCategoryCOntroller);

router.post("/delete-categories",requireSignIn,isSuperAdmin, deleteManyCategoryController)

module.exports = router;
