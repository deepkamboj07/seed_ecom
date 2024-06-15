const express = require("express");
const {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productListController,
  productPhotoController,
  searchProductController,
  updateProductController,
  uploadphoto,
  getproductsbysearch,
  deletePhoto,
  deleteManyProductController,
  changeProductAvailablityController,
  getAllProductController
} = require("../controllers/productController.js");
const { isSuperAdmin, requireSignIn } = require("../middlewares/adminMiddleware.js");

const router = express.Router();

// create product
router.post(
  "/create-product",
  requireSignIn,isSuperAdmin,
  createProductController
);

// upload 2 photos
router.post(
  "/upload-photos"
  ,requireSignIn,isSuperAdmin,
  uploadphoto
)

router.post(
  "/delete-photo",
  requireSignIn,isSuperAdmin,
  deletePhoto
)

// update product
router.post(
  "/update-product",
  requireSignIn,isSuperAdmin,
  updateProductController
);

//get products
router.get("/get-product", getProductController);

router.get("/admin/get-product",requireSignIn,isSuperAdmin, getAllProductController);

//single product
router.get("/get-single-product", getSingleProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//get products by search params
router.get("/search", getproductsbysearch)

//delete rproduct
router.delete("/delete-product/:pid",requireSignIn,isSuperAdmin, deleteProductController);


router.post("/delete-products",requireSignIn,isSuperAdmin, deleteManyProductController);


router.get("/disable-enable-product",requireSignIn,isSuperAdmin, changeProductAvailablityController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

module.exports = router;
