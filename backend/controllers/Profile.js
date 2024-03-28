const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
    try {
        //get data
        const {dateOfBirth="", about="", contactNumber, gender} = req.body;
        //get userID
        const id = req.user.id;  //payload
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:'Missing fields'
            
            })
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success:true,
            message:'Profile Updated Successfully',
            profileDetails 
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Error in updating the profile',
            error:error.message
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        //get ID
        const id = req.user.id;  //payload
        //validation
        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not found'
            })
        }
        //delete profile
        const profileId = userDetails.additionalDetails;
        await Profile.findByIdAndDelete({_id:profileId});
        //delete user
        await User.findByIdAndDelete({_id:id});
        //TODO- unenroll user fo all courses and delete enrolledCourses array from profile
        //return response
        return res.status(200).json({
            success:true,
            message:"Account Deleted Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in deleting the account",
        });
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;  //payload
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success:true,
            message:"User details fetched successfully"
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}