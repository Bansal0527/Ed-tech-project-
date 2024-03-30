const SubSection  = require('../models/SubSection');
const Section = require ("../models/Section");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require("dotenv").config();
//create Subsection

exports.createSubSection = async (req, res) => {
    try {
        //fetch data
        const {sectionId, title, timeDuration, description} = req.body;
        //extract file
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            });
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        //create a subsection
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
         
        });
        //update section with this sub section with Object ID
        const updatedSection = await Section.findByIdAndUpdate({_id: sectionId},
                                                                {
                                                                    $push:{
                                                                        subSection:SubSectionDetails._id,
                                                                    }
                                                                }, {new:true});
        return res.status(200).json({
            success:true,
            message:'Subsection created successfully',
            updatedSection
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal server error',
            error:error.message
        });
    }
};

// Update subsection 


//delete subsection 