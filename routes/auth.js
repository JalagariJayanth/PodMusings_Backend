const express = require("express");
const { googleAuthSignIn,signup,validateOTP,resendOTP,signin,resetPassword } = require("../controllers/auth");

const router = express.Router();

router.post("/google",googleAuthSignIn)

router.post("/signup",signup)

router.post("/validateOTP",validateOTP)

router.post("/resendOTP",resendOTP)

router.post("/signin",signin)

router.post("/resetPassword",resetPassword)


module.exports = router;