const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
    try {
        // 3 ways to fetch details
        //extrect token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ");

        //if token is missing
        if(!token) {
            return res.status(400).json({
                success:false,
                message:'Token is missing'
            });
        }

        //verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error) {
            //verification -issue
            return res.status(400).json({
                success:false,
                message:'Token is invalid',
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong , while validtaing the token"
        });
    }
}


//isStudent

exports.isStudent = async (req, res, next) => {
    try {
        // from 
        if(req.user.accountType !=='Student') {
            return res.status(401).json({
                success:false,
                message:"This is protected route for students only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        });
    }
}
//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {
        // from 
        if(req.user.accountType !=='Instructor') {
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructor only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        });
    }
}
//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {
        // from 
        
        if(req.user.accountType !=='Admin') {
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin only"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified"
        });
    }
}

