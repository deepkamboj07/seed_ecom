const categoryModel = require("../models/categoryModel.js");
const discountModel = require("../models/discountModel.js");

const createDiscountCoupen = async (req, res) => {
  try {
    const { code,discount,maxAmount } = req.body;
    if (!code || !discount || !maxAmount) {
      return res.status(401).send({ 
        success: false,
        message: "Please provide the required fields" });
    }
    const existingDiscount = await discountModel.findOne({ code });
    if (existingDiscount) {
      return res.status(200).send({
        success: false,
        message: "Discount Coupen Already Exist",
      });
    }
    if(await new discountModel({
       code,discount,maxAmount
    }).save()){
        res.status(200).send({
            success: true,
            message: "new coupen created",
          });
    } else{
        res.status(200).send({
            success: false,
            message: "Error While creating a Coupen",
          });
    }
    
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Errro in creating Coupen",
    });
  }
};

const updateDiscountCoupen = async (req, res) => {
  try {
    const { code, discount, maxAmount } = req.body;
    const { id } = req.query;

    const updatedCoupen = await discountModel.findByIdAndUpdate(
      id,
      { code, discount, maxAmount },
      { new: true }
    );

    if (updatedCoupen) {
      res.status(200).send({
        success: true,
        message: "Coupen Updated Successfully",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Coupen Update Failed",
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};


// get all category
const getAllDiscountCoupens = async (req, res) => {
  try {
    const coupens = await discountModel.find({});
  const modifiedCoupens = coupens.map(coupen => ({
    ...coupen.toObject(),
    key: coupen._id
  }));

  res.status(200).send({
    success: true,
    message: "All Coupens",
    category: modifiedCoupens,
  });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all coupens",
    });
  }
};

// // single category
// const get = async (req, res) => {
//   try {
//     const coupen = await categoryModel.findOne({ _id: req.query.id });
//     res.status(200).send({
//       success: true,
//       message: "Get Single Coupen Successfully",
//       coupen,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error While getting Single Category",
//     });
//   }
// };

const deleteCoupenController = async (req, res) => {
  try {
    const { id } = req.query;
    if(await discountModel.findByIdAndDelete(id)){
        return res.status(200).send({
            success:true,
            message:"Deleted Successfully",
        })
    } else {
        return res.status(200).send({
            success:false,
            message:"Error Deleting the Discount Coupen",
        })
    }

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while deleting Discount Coupen",
      error,
    });
  }
};

const deleteManyCoupensController = async (req, res) => {
  try {
    const selectedCoupens = req.body.selectedCoupens;

    await Promise.all(selectedCoupens.map(async (item) => {
      await discountModel.findByIdAndDelete(item);
    }));

    res.status(200).send({
      success: true,
      message: "Deleted Successfully",
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting coupons",
      error,
    });
  }
};




module.exports = {
    createDiscountCoupen,
    updateDiscountCoupen,
    getAllDiscountCoupens,
    deleteCoupenController,
    deleteManyCoupensController
};