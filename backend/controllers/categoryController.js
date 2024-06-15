const categoryModel = require("../models/categoryModel.js");
const slugify = require("slugify");
const productModel = require("../models/productModel.js");

//create category
const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exisits",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Errro in Category",
    });
  }
};

//update category
const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

// get all category
const categoryControlller = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
  const modifiedCategories = categories.map(category => ({
    ...category.toObject(),
    key: category._id
  }));

  res.status(200).send({
    success: true,
    message: "All Categories List",
    category: modifiedCategories,
  });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

// single category
const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//delete category
const deleteCategoryCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    await productModel.deleteMany({category:id})
    res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};

const deleteManyCategoryController = async (req, res) => {
  try {
    const selectedCategories = req.body.selectedCategories;
    selectedCategories.forEach(async(id)=>{
      await categoryModel.findByIdAndDelete(id);
      await productModel.deleteMany({category:id})
    })
    res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};



module.exports = {
  createCategoryController,
  updateCategoryController,
  deleteCategoryCOntroller,
  categoryControlller,
  singleCategoryController,
  deleteManyCategoryController
};