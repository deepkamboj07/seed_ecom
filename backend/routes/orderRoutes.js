const express = require("express");
const {
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  createOrderController,
  getSuccessOrderController,
  handlePaymentAction,
  updateTrackingLinkController,
  deleteOrderContoller,
  deleteManyOrdersController
} = require("../controllers/orderController.js");
const { requireSignIn, isSuperAdmin } = require("../middlewares/adminMiddleware.js");


const router = express.Router();

//orders
router.get("/get-order", getOrdersController);

//all orders
router.get("/all-orders", getAllOrdersController);

//create orders
router.post("/create-order", createOrderController);

// order status update
router.put("/order-status/:orderId", orderStatusController);

//get order via order Id
router.get("/get-success-order",getSuccessOrderController)

//payment webhook
router.post("/payment-webhook", handlePaymentAction)

router.post("/update-tracking-link",requireSignIn,isSuperAdmin, updateTrackingLinkController)

router.delete("/delete-order",requireSignIn,isSuperAdmin, deleteOrderContoller)

router.post("/delete-orders",requireSignIn,isSuperAdmin, deleteManyOrdersController)

module.exports = router;
