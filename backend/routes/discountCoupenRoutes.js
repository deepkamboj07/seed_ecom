const express = require("express");
const {
    createDiscountCoupen,
    updateDiscountCoupen,
    getAllDiscountCoupens,
    deleteCoupenController,
    deleteManyCoupensController
} = require("./../controllers/discountCoupenController.js");
const { requireSignIn, isSuperAdmin } = require("../middlewares/adminMiddleware.js");

const router = express.Router();

router.post("/create-discounts",requireSignIn,isSuperAdmin, createDiscountCoupen);

router.post("/update-discounts",requireSignIn,isSuperAdmin, updateDiscountCoupen);

router.get("/get-all-discounts",requireSignIn,isSuperAdmin, getAllDiscountCoupens);

router.delete("/delete-discount",requireSignIn,isSuperAdmin, deleteCoupenController);

router.post("/delete-discounts",requireSignIn,isSuperAdmin, deleteManyCoupensController)

module.exports = router;
