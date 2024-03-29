const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async (req, res) => {
    try {
        //data fetch
        const {sectionName, courseId} = req.body;

        //validate

        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message:'Missing data'
            });
        }

        
         //create section
        const newSection = await Section.create({
             sectionName,
        })
         //update course schema  with new section id 
        const updateCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                            { 
                                                                $push : 
                                                                {courseContent : newSection._id}
                                                            }, 
                                                            {new: true});
        //use populate to replace section/ subsection both in updated course details

        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updateCourseDetails
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Unable to create Section, please try again',
            error:error.message,
        })
    }
}


exports.updateSection = async (req, res) => {
    try {
        
        //data input
        const {sectionName, sectionId} = req.body;

        //data validation  
        if( !sectionName || !sectionId ) {
            return res.status(400).json({
              success: false,
              message: "Please provide all the required fields",
            });
          }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId ,{sectionName}, {new:true});

        //return res
        return res.status(200).json({
            success:true,
            message:'Section Updated Successfully',
        });


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Unable to update Section, please try again',
            error:error.message,
        })
    }
};

exports.deleteSection = async (req, res) => {
     try {

        //get ID- asuumig we are sending ID in parms
        const {sectionId} = req.parms;
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success:true,
            message:'Section Deleted Successfully',
        })
     } catch (error) {
        
     }
}