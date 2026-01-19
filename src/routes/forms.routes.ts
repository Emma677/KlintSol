import { Router } from "express";
import Form from "../model/forms.model";


const router = Router();

router.post("/forms", async (req, res) => {
  try {
    const { personalInfo, technical } = req.body;
    
    if (!personalInfo?.fullName || !personalInfo?.email) {
      return res.status(400).json({ 
        status: "error", 
        message: "Full name and email are required" 
      });
    }

    if (!technical?.role) {
      return res.status(400).json({ 
        status: "error", 
        message: "Role is required" 
      });
    }

    const application = new Form(req.body);
    await application.save();
    
    res.status(201).json({
      status: "success",
      message: "form submitted successfully",
      applicationId: application._id
    });
  } catch (error:any) {
    console.error(error);
    res.status(400).json({ 
      status: "error", 
      message: error.message || "Failed to submit application"
    });
  }
});

export default router;
