const {instance} = require("../config/razorpay");
const Course = require('../models/Course');
const User  = require('../models/User');
const mailSender = require('../utils/mailSender');

const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the Razorpay order

exports.capturePayment = async (req, res) => {
    //get courseID and userID
    const {course_id} = req.body;
    const userId = req.user.id;
    //validiation
    //valid courseID
    if(!course_id) {
        return res.status(400).json({
            success:false,
            message:'Please provide valid course ID'
        })
    };
    //valid courseDetail
    let course;
    try {
        course = await Course.findById(course_id);
        if(!course) {
            return res.status(400).json({
                success:false,
                message:'Could not find the course'
            })
        }

        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message:'User already enrolled'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
    
    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
    };

    try {
        //initiate the payment
        const paymentResponse = await instance.orders.create(options);
        console.log('Payment Response',payment);

        return res.status(200).json({
            success:true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        });
    } catch (error) {
        return res.json({
            success:false,
            message:error.message
        });
    }
    //return response

};

//verify Signature of Razorpay and server
exports.verifySignature = async (req, res) => {
     const webhookSecret = "12345678";

     const signature = req.header("x-razorpay-signature");

     crypto.createHmac("sha256",webhookSecret);

     shasum.update(JSON.stringify(req.body));
     const digest = shasum.digest("hex");

     if(signature === digest) {
        conosle.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try {
            //fulfill the action

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push:{studentsEnrolled: userId}},
                {new:true}
            );

            if(!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    message:'Course not found'
                })
            }

            conosle.log(enrolledCourse);

            //find the student and add course in their enrolled courses.
            const enrolledStudent = await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true}
            );

            console.log(enrolledStudent);

            //mail send krdo confirmation vala
            const emailResponse = await mailSender(enrolledStudent.email, "Congratulations , you are enrolled into the course", "Cougratulations, you are onboard");

            conosle.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:'Signature verified and course added'
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
     }

     else {
        return res.status(400).json({
            success:false,
            message:'Invalid request'
        })
     }



};