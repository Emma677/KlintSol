import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName:{type:String,required:true,minlength:3,maxlength:30,trim:true},
    email:{type:String,required:true,unique:true,trim:true,lowercase:true},
    password:{type:String,required:true},
    profileName:{type:String},
    bio:{type:String,maxlength:40},
    accountStatus:{type:String,enum:["active","inactive","disables"],default:'active'},
    isVerified: {type:Boolean,default:false},
    isPrivate:{type:Boolean,default:false},
    gender:{type:String,enum:['male','female']},
    phoneNumber:{type:Number,trim:true},
    resetToken: { type: String },
  resetTokenExpires: { type: Date }
})

const User = mongoose.model("User",userSchema)

export default User