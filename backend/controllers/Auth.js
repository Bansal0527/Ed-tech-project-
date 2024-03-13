const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")

require("dotenv").config();
//send otp
exports.sendOTP = async (req, res) => {
    //fetch email
    try {
            const {email} = req.body;
            
            //check if User exists
        
            const checkUserPresent = await User.findOne({email});
        
            if(checkUserPresent) {
                return res.status(400).json({
                    success:false,
                    message:'User already registered'
                });
            }

            //generate otp
            var otp = otpGenerator(6, {
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
            console.log("OTP :",otp);

            //check unique otp or not
            let result = await OTP.findOne({otp:otp});
            while(result) {
                otp = otpGenerator(6, {
                    upperCaseAlphabets:false,
                    lowerCaseAlphabets:false,
                    specialChars:false
                });
                result = await OTP.findOne({otp:otp});
            }

            // create entry in db
            const otpPayload = {email, otp};

            const otpBody = await OTP.create(otpPayload);
            console.log(otpBody);

            res.status(200).json({
                success:true,
                message:'OTP sent successfully',
                otp,
            })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
//signup
exports.signUp = async (req, res) => {
    //fetch data
    try {
            const {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                accountType,
                contactNumber,
                otp
            } = req.body;
            //validate krlo
            if(!firstName||!lastName || !email || !password || !confirmPassword ||! otp) {
                return res.status(400).json({
                    success:false,
                    message:"All fields are required",
                })
            }
            //2 password match kro
            if(password !== confirmPassword) {
                return res.status(400).json({
                    success:false,
                    message:"Passwords do not match",
                })
            }
        
            //check user already exists or not 
            const existingUser = await User.findOne({email});
            if(existingUser) {
                return res.status(400).json({
                    success:false,
                    message:"User is already registered",
                });
            }
            //find the most recent otp stored for the user
            const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
            console.log("Recent OTP :", recentOtp);
            //validate otp
            if(recentOtp.length == 0) {
                return res.status(400).json({
                    success:false,
                    message:"OTP not found",
                });
            } else if(otp !== recentOtp) {
                //Invalid otp
                return res.status(400).json({
                    success:false,
                    message:"Invalid OTP",
                });
            }
            //hash password
            const hashedPasssword = await bcrypt.hash(password, 10);
            //create entry in db
            const  profileDetails = await Profile.create({
                gender:null,
                dateOfBirth:null,
                about:null,
                contactNumber:null,
            });
        
            const user = await User.create({
                firstName,
                lastName,
                email,
                contactNumber,
                password:hashedPasssword,
                accountType,
                additionalDetails:profileDetails._id,
                image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
            })

        // return res
        res.status(200).json({
            success:true,
            message:'User registered successfully',
            user,
        });

    } catch (error) {
        return res.status(500).json({
                success:false,
                message:"User cannot be registered , try again",
            })
    }

}
//login

exports.login = async (req, res) => {
    try {
            //fetch data
            const {email, password} = req.body;

            //validation 
            if(!email || !password) {
                return res.status(400).json({
                    success:false,
                    message:"All fields are required",
                })
            }
            // check if user exist
            const user = await User.findOne({email}).populate("additionalDetails");
            if(!user) {
                return res.status(400).json({
                    success:false,
                    message:"User is not registered, Please signup",
                })
            }
            //generate jwt
            const payload = {
                email: user.email,
                id: user._id,
                role:user.role,
            }
            if(await bcrypt.compare(password, user.password)) {
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '2h'
                });
            
                user.token = token;
                user.password = undefined;
            
            //create cookie
                const options = {
                    expires: new Date(Date.now() + 3*24*60*60*1000),
                    httpOnly:true,
                }

                res.cookie("token", token, options).status(200).json({
                    success:true,
                    token,
                    user,
                    message:'Logged In successfully',
                });
            }
            else{
                return res.status(400).json({
                    success:false,
                    message:"Password incorrect",
                });
            }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Login Failed",
        });
    }
}

//change password

exports.changePassword = async (req, res) => {
    //get data
    // get oldPassword, newPassword, confirmedPassword
    //validation

    //update password in db
    //send mail - password updated

    //return res
}