const productModel = require("../models/productModel.js");
const categoryModel = require("../models/categoryModel.js");
const fs = require("fs");
const slugify = require("slugify");
const { uploadToS3PM, deleteFileFromS3 } = require("../service/AWS/index.js");
const { v4: uuidv4 } = require("uuid");
const photoModel = require("../models/photoModel.js");
const formidable = require("formidable");
const { Console } = require("console");
const { trusted } = require("mongoose");

const uploadphoto = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form: ", err);
      return res.status(500).json({ error: "Something went wrong" });
    }
    const { productId } = fields;
    const photos = Array.isArray(files.photo) ? files.photo : [files.photo];

    try {
      if (!productId || !photos || photos.length == 0) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid photo data" });
      }
      for (const photo of photos) {
        const fileName = `${uuidv4()}-${photo.name}`;
        const mimeType = photo.type;
        const buffer = fs.readFileSync(photo.path);
        const path = `/products/${productId}`;
        const response = await uploadToS3PM(path, fileName, buffer, mimeType);
        const key = response.key;

        try {
          const product = await productModel.findOne({ _id: productId });
          if (product.photo) {
            const photo = await photoModel.findOne({ _id: product.photo });
            photo.keys.push(key);
            await photo.save();
          } else {
            const keyId = await photoModel.create({ keys: [key] });
            const photoId = keyId._id;
            product.photo = photoId;
            await product.save();
          }
        } catch (error) {
          res.status(500).send({
            success: false,
            message: "An error occurred while processing the request",
          });
        }
      }
      res.status(200).send({
        success: true,
        message: "An error occurred while processing the request",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "An error occurred while processing the request",
      });
    }
  });
};

const updateProductController = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Something went wrong" });
    }
    const {
      productId,
      name,
      category,
      price,
      quantity,
      description,
      keys
    } = fields;

    if (
      !productId ||
      !name ||
      !category ||
      !price ||
      !quantity ||
      !description
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const keysArray = keys ? keys.split(",") : [];

    try {
      let awsKeys = [];
      if (files.photo) {
        const photos = Array.isArray(files.photo) ? files.photo : [files.photo];
        for (const photo of photos) {
          const fileName = `${uuidv4()}-${photo.name}`;
          const mimeType = photo.type;
          const buffer = fs.readFileSync(photo.path);
          const path = `/products/${productId}`;
          const response = await uploadToS3PM(path, fileName, buffer, mimeType);
          awsKeys.push(response.key);
        }
      }

      const productUpdate = {
        name,
        category,
        price,
        quantity,
        description,
        slug: slugify(name),
      };


      const mergedKeys = [...keysArray, ...awsKeys].map(String);
      const product = await productModel.findByIdAndUpdate(
        productId,
        productUpdate,
        { new: true }
      );

      const response = await photoModel.findByIdAndUpdate(product.photo, {keys:mergedKeys}, {
        new: true,
      });

      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        error,
        message: "Error in Update product",
      });
    }
  });
};

const deletePhoto = async (req, res) => {
  const { key } = req.body;

  try {
    if (!key) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid key data" });
    }

    const response = await deleteFileFromS3(key);

    res
      .status(200)
      .send({ success: true, message: "Photo deleted successfully" });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).send({
      success: false,
      message: "An error occurred while deleting the photo",
    });
  }
};

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const product = new productModel({
      name,
      description,
      price,
      category: category,
      quantity,
      slug: slugify(name),
    });

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      productId: product._id,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//get products by search
const getproductsbysearch = async (req, res) => {
  const search = req.query.search;
  let products = [];

  try {
    products = await productModel
      .find({ name: { $regex: search, $options: "i" },available:true }, { name: 1, _id: 1 })
      .limit(10);
    return res.status(200).send({ success: true, products: products });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "no products found" });
  }
};

//get all products
const getProductController = async (req, res) => {
  const all = req.query.all;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const category = req.query.category || "";
  const priceRange = [req.query.priceRange] || "";
  const search = req.query.search || "";
  let args = { available: true }

  if (search.length > 0) {
    args.name = { $regex: search, $options: "i" };
  }
  if (category.length > 0) {
    args.category = category;
  }
  if (priceRange[0]) {
    priceArray = priceRange[0].split(",");
    args.price = { $gte: priceArray[0], $lte: priceArray[1] };
  }

  try {
    let totalCount = 0;
    let totalPages = 0;
    let products = [];
    const skip = (page - 1) * limit;

    if (all === "true") {
      products = await productModel
        .find({available:true})
        .populate("category photo")
        .sort({ createdAt: -1 });
      totalCount = await productModel.countDocuments({available:true});
      totalPages = Math.ceil(totalCount / limit);
    } else {
      products = await productModel
        .find(args)
        .skip(skip)
        .limit(limit)
        .populate("category photo")
        .sort({ createdAt: -1 });
      totalCount = await productModel.find(args).countDocuments({available:true});
      totalPages = Math.ceil(totalCount / limit);
    }

    const modifiedProducts = products.map((product) => ({
      ...product.toObject(),
      key: product._id,
    }));

    res.status(200).send({
      success: true,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      message: "All Products",
      products: modifiedProducts,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

const getAllProductController = async (req, res) => {
  const all = req.query.all;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const category = req.query.category || "";
  const priceRange = [req.query.priceRange] || "";
  const search = req.query.search || "";
  let args = {};

  if (search.length > 0) {
    args.name = { $regex: search, $options: "i" };
  }
  if (category.length > 0) {
    args.category = category;
  }
  if (priceRange[0]) {
    priceArray = priceRange[0].split(",");
    args.price = { $gte: priceArray[0], $lte: priceArray[1] };
  }

  try {
    let totalCount = 0;
    let totalPages = 0;
    let products = [];
    const skip = (page - 1) * limit;

    if (all === "true") {
      products = await productModel
        .find()
        .populate("category photo")
        .sort({ createdAt: -1 });
      totalCount = await productModel.countDocuments();
      totalPages = Math.ceil(totalCount / limit);
    } else {
      products = await productModel
        .find(args)
        .skip(skip)
        .limit(limit)
        .populate("category photo")
        .sort({ createdAt: -1 });
      totalCount = await productModel.find(args).countDocuments();
      totalPages = Math.ceil(totalCount / limit);
    }

    const modifiedProducts = products.map((product) => ({
      ...product.toObject(),
      key: product._id,
    }));

    res.status(200).send({
      success: true,
      currentPage: page,
      totalPages: totalPages,
      totalCount: totalCount,
      message: "All Products",
      products: modifiedProducts,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// get single product
const getSingleProductController = async (req, res) => {
  try {
    const pid = req.query.pid;
    const product = await productModel
      .findOne({ _id: pid })
      .populate("category photo");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};

//delete controller
const deleteProductController = async (req, res) => {
  try {
    const id = req.params.pid;
    const product = await productModel.findById(id);
    if (product && product.photo) {
      await photoModel.findByIdAndDelete(product.photo);
    }
    await productModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// product count
const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// get products by category
const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

const deleteManyProductController = async (req, res) => {
  try {
    const selectedProducts = req.body.selectedProducts;
    selectedProducts.forEach(async (id) => {
      const product = await productModel.find({ id });
      if (product && product.photo) {
        await photoModel.findByIdAndDelete(product.photo);
      }
      await productModel.findByIdAndDelete(id);
    });
    res.status(200).send({
      success: true,
      message: "Products Deleted Successfully",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error while deleting products",
      error,
    });
  }
};

const changeProductAvailablityController = async (req, res) => {
  try {
    const {id,checked} = req.query;
    if(await productModel.findByIdAndUpdate(id,{available:checked})){
      res.status(200).send({
        success: true,
        message: "Products Updated Successfully",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Please Try Again Later",
      });
    }
    
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "error while updating products",
      error,
    });
  }
};

module.exports = {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productCountController,
  productListController,
  searchProductController,
  productCategoryController,
  uploadphoto,
  getproductsbysearch,
  deletePhoto,
  deleteManyProductController,
  changeProductAvailablityController,
  getAllProductController
};
