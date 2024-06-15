const orderModel = require("../models/orderModel");
const Razorpay = require("razorpay");
const crypto = require("crypto");

var razorpayInstance = new Razorpay({
  key_id: "rzp_test_NeqnD1is8CCE6c",
  key_secret: "r1euqKDrwfXAmZCROGq4UvIj",
});

const createOrderController = async (req, res) => {
  try {
    products = [];
    const { productArray, buyerId, code, amount } = req.body;

    await orderModel.findOneAndDelete({ buyer: buyerId, status: "Pending" });

    productArray.forEach((item) => {
      products.push(item._id);
    });

    const order_instance = await razorpayInstance.orders.create({
      amount: parseInt(amount * 100),
      currency: "INR",
      notes: {
        buyer: buyerId,
      },
    });

    const order = await orderModel.create({
      products: products,
      buyer: buyerId,
      status: "Pending",
      code: code,
      orderId: order_instance.id,
      price: amount
    });

    console.log(order_instance);


    if (order) {
      res
        .status(200)
        .send({ success: true, message: "successfully created the order" });
    } else {
      res.status(500).send({ success: false, message: "Something Went Wrong" });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error
    });
  }
};

const getSuccessOrderController = async (req, res) => {
  const orderId = req.query.id;
  try {
    if (orderId) {
      const order = await orderModel
        .findOne({
          orderId: orderId,
          status: "Captured",
        }).populate("buyer")
        .populate({
          path: "products",
          populate: {
            path: "photo",
          },
        });
      if (order) {
        return res.status(200).send({ success: true, order: order });
      } else {
        return res.status(200).send({ success: false });
      }
    } else res.status(500).send("orderId not provided");
  } catch (error) {
    res.status(500).send({ message: "internal server error" });
  }
};

//orders
const getOrdersController = async (req, res) => {
  const buyerId = req.query.id;
  try {
    const orders = await orderModel
      .find({ buyer: buyerId, status: "Pending" })
      .populate({
        path: "products",
        populate: {
          path: "photo",
        },
      })
      .populate({
        path: "products",
        populate: {
          path: "category",
        },
      })
      .populate("buyer");
    res.status(200).send({ success: true, order: orders });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error While Geting Orders",
      error,
    });
  }
};

const getAllOrdersController = async (req, res) => {
  try {
  const all = req.query.all;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const ordersWithoutKey = await orderModel
      .find({})
      .populate({
        path: "products",
        populate: {
          path: "photo",
        },
      })
      .populate("buyer")
      .sort({ createdAt: -1 }).skip(skip)
      .limit(limit)

      const orders = ordersWithoutKey.map(order => ({
        ...order._doc,
        key: order._id,
      }));

    if (orders) {
      totalCount = await orderModel.find({}).countDocuments();
      totalPages = Math.ceil(totalCount / limit);
      return res.status(200).send({
        success: true,
        orders,
        totalCount,
        totalPages
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "Error Getting Products",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

const updateTrackingLinkController = async (req, res) => {
  try {
    const { orderId, trackingId } = req.body;
    if (
      await orderModel.findOneAndUpdate(
        { orderId: orderId },
        { tracking: trackingId }
      )
    ) {
      res.status(200).send({
        success: true,
        message: "Tracking Link Updated",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Failed to update tracking Link",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

const deleteOrderContoller = async (req, res) => {
  try {
    const { id } = req.query;
    if (await orderModel.findOneAndDelete({ _id: id })) {
      res.status(200).send({
        success: true,
        message: "Order Deleted Successfully",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Failed To Delete Order",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

const deleteManyOrdersController = async (req, res) => {
  try {
    const { selectedOrders } = req.body;
    const deletePromises = selectedOrders.map(id => orderModel.findOneAndDelete({ _id: id }));
    const results = await Promise.all(deletePromises);

    const allDeleted = results.every(result => result !== null);

    if (allDeleted) {
      res.status(200).send({
        success: true,
        message: "Orders Deleted Successfully",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Failed To Delete Some Orders",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};


//order status
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

const handlePaymentAction = async (req, res) => {
  const SECRET = process.env.PAYMENT_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const event = req.body.event;

  const body = JSON.stringify(req.body).toString();

  // Verify the signature
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(body)
    .digest("hex");

  console.log(expectedSignature, signature);
  if (signature === expectedSignature) {
    const payload = req.body.payload;
    const paymentEntity = payload.payment.entity;

    console.log(event);

    switch (event) {
      case "payment.authorized":
        await handleAuthorizedPayment(paymentEntity);
        break;
      case "payment.captured":
        await handleCapturedPayment(paymentEntity);
        break;
      case "payment.failed":
        await handleFailedPayment(paymentEntity);
        break;
      default:
        return res.status(400).send("Unhandled event type:", event);
    }

    console.log("working Fine",)
    res.json({ status: "ok" });
  } else {
    console.log("verification failed");
    res.status(400).send("Webhook Signature Verification Failed");
  }
};

async function handleAuthorizedPayment(payment) {
  try {
    await orderModel.findOneAndUpdate(
      { orderId: payment.order_id },
      { $set: { status: "Authorized" } }
    );
  } catch (error) {
    return;
  }
}

async function handleCapturedPayment(payment) {
  try {
    await orderModel.findOneAndUpdate(
      { orderId: payment.order_id },
      {
        $set: {
          status: "Captured",
          transaction: new Date().toISOString().replace("Z", "+00:00"),
        },
      }
    );
  } catch (error) {
    return;
  }
}

async function handleFailedPayment(payment) {
  try {
    await orderModel.findOneAndUpdate(
      { orderId: payment.order_id },
      { $set: { status: "Failed" } }
    );
  } catch (error) {
    return;
  }
}

module.exports = {
  createOrderController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getSuccessOrderController,
  handlePaymentAction,
  updateTrackingLinkController,
  deleteOrderContoller,
  deleteManyOrdersController,
};
