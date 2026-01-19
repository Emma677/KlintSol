import mongoose from "mongoose";


const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technologies: { type: String, required: true },
  link: { type: String, required: true }
});

const formSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String,required: true },
    location: { type: String },
    url: { type: String }
  },
  technical: {
     role: { 
      type: String, 
      required: true, 
      enum: ["frontend", "backend", "devops"],
      lowercase: true,
      trim: true
    },
    experience: { type: String },
    skills: { type: [String], default: [] },
    otherSkills: { type: String }
  },
  projects: { type: [ProjectSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Form = mongoose.model("formSchema", formSchema);

export default Form
