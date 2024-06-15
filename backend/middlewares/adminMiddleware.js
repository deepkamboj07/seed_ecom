const JWT = require("jsonwebtoken")
const adminModel = require("../models/adminModel")

//Protected Routes token base
const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    return res.status(400).send({
        success:false,
        message:"UnAuthorized Access",
        error
    })
  }
};

const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await adminModel.findById(req.user);
    if (!user || (user.role !== "superAdmin" && user.role !== "admin")){
        return res.status(400).send({
            success:false,
            message:"UnAuthorized Access"
        })
    }   
    next() 
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error in admin middelware",
      error
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await adminModel.findById(req.user);
    if (!user || user.role !== "admin"){
        return res.status(400).send({
            success:false,
            message:"UnAuthorized Access"
        })
    }   
    next() 
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "Error in admin middelware",
      error
    });
  }
};

module.exports = {requireSignIn,isAdmin,isSuperAdmin}