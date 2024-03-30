const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//create rating
exports.createRating = async (req, res) => {
    try {
        
        //get userId
        const userId = req.user.id;
        //fetch data

        const {rating, review, courseId} = req.body;

        // check if user is enrolled
        const courseDetails = await  Course.findByOne(
                                                    {_id:courseId, 
                                                    studentsEnrolled: {$elemMatch: {$eq:userId}},
                                                     });

        if(!courseDetails) {
            return res.status(400).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        }
        //check if already rated
        const alreadyReviewed = await RatingAndReview.findOne({
                                                            user:userId ,
                                                            course:courseId
                                                            });
        
        if(alreadyReviewed) {
            return res.status(400).json({
                success:false,
                message:"Already reviewed by the user"
            });
        }

        //crate rating and review
        const ratingReview = await RatingAndReview.create({
                                                        rating, review,
                                                        course:courseId,
                                                        user:userId
                                                        });
        //update course with rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                        {
                                            $push: {
                                                ratingAndReviews: ratingReview,
                                            }
                                        },
                                        {new:true});
        console.log(updatedCourseDetails);

        return res.status(200).json({
            success:true,
            message:"Rating and Review created Successfully",
            ratingReview
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get average rating
exports.getAverageRating = async (req, res) => {
    try {
        //get course id
        const  courseId = req.body.courseId;
        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId),   //string to object id
                }, 
            },
            {
                $group:{
                    _id:null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ])
        //return rating

        if(result.length > 0) {
            return res.status(200).json({
                success:true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating

        return res.status(200).json({
             success:true,
             message:'Average Raing is 0, no rating given till now',
             averageRating:0,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// get all rating

exports.getAllRating = async (req, res) => {
    try {
        const  allReviews = await RatingAndReview.find({})
                                  .sort({rating: "desc"})
                                  .populate({
                                    path:"user",
                                    select:"firstName lastName email image"
                                  })
                                  .populate({
                                    path:"course",
                                    select:"courseName"
                                  })
                                  .exec();

        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        }) 
    }
}