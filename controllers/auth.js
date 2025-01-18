
const { createError } = require("../error");
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utilities/sendEmail");
const { generateOTP, isOTPValid } = require("../utilities/otp");
const bcrypt = require("bcryptjs");
const verificationBody = require("../utilities/emailTemplate");

const googleAuthSignIn = async(req,res,next) =>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            try{
                const user = new User({ ...req.body, googleSignIn: true });
                await user.save();
                const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1 year"});
                res.status(200).json({token,user:user})

            }catch(err){
                next(err);
            }

        }else if(user.googleSignIn){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1 year"});
            res.status(200).json({token,user})
        }else if(user.googleSignIn === false){
            return next(createError(201,"User already exists with this email can't do google auth"))
        }

    }catch(err){
        next(err);
    }
}

const signup = async (req,res,next) => {
    const formData = req.body;
    const {email,name,password} = formData
    
    if(!email || !name || !password){
        return res.status(400).send({ message: "All fields are required." });
    }

    try{
        const userExists = await User.findOne({email});
        if(userExists){
            if(userExists.googleSignIn){
                return next(createError(400,"User already exists with this email"))
            }else if(userExists.otp === null){
                 return res.status(400).json({message:"Account already exists."})
            }
            
            else{
                const otp = generateOTP();
                const otpExpiration = new Date(Date.now()+ 60000);
                
                userExists.name = name;
                userExists.password = await bcrypt.hash(password,10);
                userExists.otp = otp;
                userExists.otpExpiration = otpExpiration;
                await userExists.save();

                await sendEmail(userExists.email,"Account Verification OTP",verificationBody("Verify",otp,name))

                return res.status(200).send({message:"OTP sent to your email.",otpExpiration: otpExpiration.toISOString()})
            }

        }else{
            const otp = generateOTP();
            const otpExpiration = new Date(Date.now() + 60000);
            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = new User({
                name,
                email,
                password:hashedPassword,
                otp,
                otpExpiration,
                googleSignIn:false
            })

            await newUser.save();

            await sendEmail(newUser.email,"Account Verification OTP",verificationBody("verify",otp,name))
            
            return res.status(200).send({message:"User Created and OTP sent for verification",otpExpiration: otpExpiration.toISOString(),})
        }

    }catch(err){
        next(err)
    }

    

}

const validateOTP = async(req,res,next) =>{

    const { email,otp } = req.body;

    try{
        const user = await User.findOne({ email });
        
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        if (!user.otp || !user.otpExpiration) {
            return res.status(400).json({ message: "No OTP request found for this user" });
        }

        if (user.otp.trim() !== otp.trim()) {
            return res.status(400).json({ message: "Invalid OTP" });
            
        }

        if(isOTPValid(user.otpExpiration)){
            return res.status(400).json({message:"OTP has expired"});
        }

       

        user.otp = null;
        user.otpExpiration = null;
        await user.save();

        return res.status(200).json({message:"OTP verified successfully"});


    }catch(err){
        next(err);
    }
}

const resendOTP = async(req,res,next) =>{
     const {email,reason} = req.body;
     try{
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentTime = new Date();
        if(user.otpExpiration && user.otpExpiration > currentTime){
            return res.status(400).json({message:"You can only request a new OTP after the previous one expires."})
        }

        const otp = generateOTP();
        const otpExpiration = new Date(Date.now() +60000);
        const mailSubject = reason === "resend" ? "Account Verification OTP" :"Password Reset Verification OTP";
        const message = reason === "resend" ? "OTP resent to your email" : "Password reset OTP has been sent to your email."
        
        user.otp = otp;
        user.otpExpiration = otpExpiration;
        await user.save();

        await sendEmail(user.email,mailSubject,verificationBody(reason,otp,user.name));
        return res.status(200).json({message:message,otpExpiration: otpExpiration.toISOString()})


     }catch(err){
        next(err);
     }
}

const signin = async(req,res,next) => {
    const formData = req.body;
    const {email,password} = formData
    try{
        const user = await User.findOne({email})

        if(!user){
            return next(createError(201,"User not found"));
        }

        if(user.googleSignIn){
            return next(createError(201, "Entered email is Signed Up with google account. Please SignIn with google."))
        }
        const validPassword = await bcrypt.compare(password,user.password);

        if(!validPassword){
            return next(createError(201,"Wrong password entered"))
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1 year"});
        res.status(200).json({token,user})
    }catch(err){
        next(err)
    }
}

const resetPassword = async(req,res,next) => {
    try{
        const {resetFormData,otp} = req.body;
  
        if(!resetFormData){
            return res.status(400).json({message:"Invalid request format"})
        }
        const {email,password,confirmPassword} = resetFormData;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message:"User not found"})
        }

        if (!user.otp || !user.otpExpiration) {
            return res.status(400).json({ message: "No OTP request found for this user" });
        }

        if(user.otp !== otp){
            return res.status(400).json({ message: "Invalid OTP" });
        }
        
        if(isOTPValid(user.otpExpiration)){
            return res.status(400).json({message:"OTP has expired"});
        }

        user.otp = null;
        user.otpExpiration = null;

        const hashedPassword = await bcrypt.hash(confirmPassword,10)
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({message:"Password changed successfully"})
        

    }catch(err){
        next(err);
    }


}




module.exports = {googleAuthSignIn,signup,validateOTP,resendOTP,signin,resetPassword}