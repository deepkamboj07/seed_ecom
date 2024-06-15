const express = require("express");
const discountModel = require("../models/discountModel");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const adminModel = require("../models/adminModel");
const { requireSignIn, isAdmin } = require("../middlewares/adminMiddleware");
const jwt = require("jsonwebtoken");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const photoModel = require("../models/photoModel");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { uploadToS3PM } = require("../service/AWS");
const path = require("path");
const { default: slugify } = require("slugify");

const router = express.Router();

router.get("/get-discount", async (req, res) => {
  try {
    const { code } = req.query;
    const validity = await discountModel.findOne({ code: code });
    if (validity) {
      res
        .status(200)
        .send({
          status: true,
          discount: validity.discount,
          maxAmount: validity.maxAmount,
        });
    } else {
      res.status(400).send({ status: false, message: "Invalid Discount Code" });
    }
  } catch (error) {
    console.error("Error fetching discount:", error);
    res.status(500).send({
      status: false,
      message: "An error occurred while fetching the discount",
    });
  }
});

router.post("/add-user", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      city,
      state,
      postalCode,
      landmark,
    } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !address ||
      !city ||
      !state ||
      !postalCode ||
      !landmark
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    let existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      existingUser.name = `${firstName}-${lastName}`;
      existingUser.phone = phoneNumber;
      existingUser.address = {
        address,
        city,
        state,
        postalCode,
        landMark: landmark,
      };
      await existingUser.save();
      return res.status(200).json({
        success: true,
        message: "User details updated successfully",
        user: existingUser._id,
      });
    }

    const newUser = await userModel.create({
      name: `${firstName}-${lastName}`,
      email,
      phone: phoneNumber,
      address: {
        address,
        city,
        state,
        postalCode,
        landMark: landmark,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/get-user", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send({
        success: false,
        msg: "Unauthorised access",
      });
    }
    const user = await userModel.findOne({ _id: id });
    res.status(200).send({ success: true, user });
  } catch (error) {
    res.status(500).send({ success: false, msg: "Internal Server Error" });
  }
});

router.post("/admin/create", requireSignIn, isAdmin, async (req, res) => {
  try {
    const { email, password, token, role } = req.body;

    if (!email || !password || !token || !role) {
      return res
        .status(400)
        .send({ success: false, message: "Unauthorized Access" });
    }

    if (await adminModel.findOne({email:email})){
      return res.status(200).send({
        success:false,
        message:"Email Already Exists"
      })
    }

    if (token !== process.env.ADMIN_TOKEN) {
      return res
        .status(400)
        .send({ success: false, message: "Unauthorized Access" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new adminModel({
      email: email,
      password: hashedPassword,
      role: role,
    });

    await newAdmin.save();

    return res
      .status(200)
      .send({ success: true, message: "Admin created successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
});

router.post("/admin/access", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Email and password are required" });
    }

    const admin = await adminModel.findOne({ email });

    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res
        .status(200)
        .send({ success: false, message: "Wrong Credentials" });
    }

    if (rememberMe === true) {
      const token = jwt.sign(
        { email: admin.email, _id: admin._id, role:admin.role },
        process.env.JWT_SECRET,
        {
          expiresIn:"3d"
        }
      );
      return res.status(200).send({ success: true, token });
    } else if (rememberMe === false) {
      const token = jwt.sign(
        { email: admin.email, _id: admin._id, role:admin.role  },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      return res.status(200).send({ success: true, token });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
});

router.get("/admin/get-all", requireSignIn, isAdmin, async(req, res) => {
  try {
    const currentUserId = req.user._id
    const users = await adminModel.find({ _id: { $ne: currentUserId } })
    if (!users){
      return res.status(200).send({
        success:false,
        message:"UnAuthorized Access"
      })
    } else {
      const updatedUsers = users.map(item => {
        const userObject = item.toObject();
        delete userObject.password;
        return {
          ...userObject,
          key: item._id
        };
      });
      return res.status(200).send({ success: true, users:updatedUsers });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
});

router.get("/admin/delete", requireSignIn, isAdmin, async(req, res) => {
  try {
    const {id} = req.query
    const userDeleted = await adminModel.findByIdAndDelete(id)
    if (!userDeleted){
      return res.status(200).send({
        success:false,
        message:"Something Went Wrong"
      })
    } else {
      return res.status(200).send({ success: true });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error", error });
  }
});

router.post("/admin/delete-all", requireSignIn, isAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    await Promise.all(ids.map(async(item)=>{
      await adminModel.findByIdAndDelete(item)
    }))
    return res.status(200).send({
        success: true,
        message: "Deleted Successfully"
      });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Internal Server Error", error });
  }
});

router.get("/verify-token", async(req,res,next) => {
  try{
    const {token} = req.query
    if (!token){
      return res.status(400).send({
        success:false,
        message:"Token is required"
      })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).send({
      success:true,
      message:"Token is valid",
      decoded
    })
  }catch(error){
    return res.status(500).send({ success: false, message: "Internal Server Error", error });
  }
});

// router.get("", async (req, res) => {
//   try {
//     const categories = await categoryModel.find();
//     const idList = categories.reduce((accumulator, item) => {
//       accumulator.push(item._id);
//       return accumulator;
//     }, []);
//     const units = ["grams", "kg", "meters"];
//     let errors = [];

//     for (let i = 0; i < 10; i++) {
//       for (const item of idList) {
//         const unit = units[Math.floor(Math.random() * units.length)];
//         const quantity = `${Math.floor(Math.random() * 100) + 1} ${unit}`;
//         const product = await productModel.create({
//           name: `Product ${i}-${item}`,
//           description: `Description for product ${i}-${item}`,
//           quantity: quantity,
//           price: (Math.random() * 100).toFixed(2),
//           category: item,
//           slug:slugify(`Product ${i}-${item}`)
//         });

//         const photoPath =
//           "C:\\Users\\cours\\OneDrive\\Desktop\\images\\a26qiegjj2o01.jpg";
//         const photoName = path.basename(photoPath);
//         const photoExtension = path.extname(photoPath);

//         const photoReq = {
//           fields: { productId: product._id },
//           files: {
//             photos: {
//               path: photoPath,
//               name: photoName,
//               type: `image/${photoExtension}`,
//             },
//           },
//         };

//         const result = await uploadphoto(photoReq);
//         if (!result.success) {
//           errors.push({ productId: product._id, error: result.message });
//         }
//       }
//     }

//     if (errors.length > 0) {
//       res.status(500).send({
//         success: false,
//         message: "Some photos failed to upload",
//         errors: errors,
//       });
//     } else {
//       res.send({ success: true, message: "Dummy data created successfully" });
//     }
//   } catch (error) {
//     res.status(500).send({
//       success: false,
//       message: "An error occurred while creating dummy data",
//       error: error.message,
//     });
//   }
// });

// const uploadphoto = async (req) => {
//   const { productId } = req.fields;
//   const photo = req.files.photos;

//   try {
//     if (!productId || !photo) {
//       return { success: false, message: "Invalid photo data" };
//     }

//     const fileName = `${uuidv4()}-${photo.name}`;
//     const mimeType = photo.type;
//     const buffer = fs.readFileSync(photo.path);
//     const path = `/products/${productId}`;
//     const response = await uploadToS3PM(path, fileName, buffer, mimeType);
//     const key = response.key;

//     const product = await productModel.findOne({ _id: productId });
//     if (product.photo) {
//       const photoDoc = await photoModel.findOne({ _id: product.photo });
//       photoDoc.keys.push(key);
//       await photoDoc.save();
//     } else {
//       const keyId = await photoModel.create({ keys: [key] });
//       const photoId = keyId._id;
//       product.photo = photoId;
//       await product.save();
//     }

//     return { success: true, message: "Photo uploaded successfully" };
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return {
//       success: false,
//       message: "An error occurred while processing the request",
//     };
//   }
// };

module.exports = router;
