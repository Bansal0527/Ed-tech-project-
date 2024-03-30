const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//resetPassword token
exports.resetPasswordToken = async (req, res) => {
    try {
            //get email from body
            const email = req.body.email;
            //check user for this email
            const user = User.findOne({email:email});
            if(!user) {
                return res.json({
                    success:false,
                    message:'Your Email is not registered'
                })
            }
            //generate token 
            const token = crypto.randomUUID();
            //update user by adding token and expiration time
            const updatedDetails = await User.findOneAndUpdate(
                                                                {email:email},
                                                                {
                                                                    token:token,
                                                                    resetPasswordExpires: Date.now() + 5*60*1000,
                                                                },
                                                                {new:true});
                                                                
            //create url
            const url = `http:localhost:3000/update-password/${token}`
        
            //send mail
            await mailSender(email, 
                            "Password Reset Link",
                            `Password Reset Link: ${url}`);
            //return response,
        
            return res.json({
                success:true,
                message:'Email sent successfully, please check email and change password'
            })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Something went wrong , while reseting the password'
        });
    }


}

//reset password

exports.resetPassword = async (req, res) => {
    //data fetch
    try {
            const {password, confirmPassword, token} = req.body;  //frontend ne dala h
        
            // validation
            if(password !== confirmPassword) {
                return res.json({
                    success:false,
                    message:'Password not matching'
                });
            }
            //get userDetails from db using token
            const userDetails = await User.findOne({token: token});
            //if no entry - invalid token
            if(!userDetails) {
                return res.json({
                    success:false,
                    message:'Token is invalid'
                });
            }
            //token time check
            if(userDetails.resetPasswordExpires < Date.now()) {
                return res.json({
                    success:false,
                    message:'Token expired, please regenerate'
                });
            }
            //hash password
            const hashedPasssword = await bcrypt.hash(password, 10);
            //update password
            await User.findOneAndUpdate(
                {token:token},
                {password: hashedPasssword},
                {new:true},
            );
            //return res
            return res.status(200).json({
                success:true,
                message:'Password reset successfully'
            });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Something went wrong , while reseting the password'
        })
    }
}