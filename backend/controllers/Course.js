const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

require("dotenv").config();

//createCourse handler fn
exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        //get thumbanail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || ! whatYouWillLearn || !price || !tag || !thumbnail){
            return  res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        //check if instructor - to store instructor id
        const userId = req.user.id // payload mei store h
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ",instructorDetails);

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:"Istructor Details not found"
            });
        }

        //check tag is vaild 
        //tag id h
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails) {
            return  res.status(404).json({
                success: false,
                message: 'Tag does not exist'
            })
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course

        const newCourse = await  Course.create({
            courseName : courseName,
            courseDescription: courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        //add the new course to user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        //update Tag schema
        await Tag.findByIdAndUpdate(
            {_id: tagDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true},
        )

        return res.status(200).json({
            success:true,
            messsage:"Course created successfully",
            data:newCourse,
        })
    }
     catch (error ) {
        return res.status(500).json({
            success:false,
            messsage:"Failed to create course",
            error:error.message
        })
    }
}

// getAll Courses handler fn

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {courseName:true, price:true, instructor:true,thumbnail:true, ratingAndReviews:true, studentsEnrolled:true }).populate("instructor").exec();
        return res.status(200).json({
            success:true,
            messsage:"Data for all courses fetched successfully",
            data:allCourses,
        })   
    } catch (error) {
        return res.status(500).json({
            success:false,
            messsage:"Cannot fetch the courses",
            error:error.message
        })
    }
}