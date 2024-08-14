import { get } from "browser-sync";
import mongoose, { set } from "mongoose";

// Defining Schema
const userSchema = new mongoose.Schema({

    firstname:{
        type:String,
        required:true,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        trim:true
    },
    recoveryEmail:{
        type:String,
        required:true,
        trim:true
    },
    contact_number:{
        type:String,
        required:true,
        trim:true
    },
    /*otp: {
        type: String,
        required:true
    },
    otpExpiry: {
        type: Date,
        default: Date.now,
        get: (otpExpiry) => otpExpiry.getTime(),
        set: (otpExpiry) => new Date(otpExpiry)
    },
    */
    isVerified: {
        type: Boolean,
        default: false,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    tc:{
        type:Boolean,
        required:true,
        trim:true
    }
})

// Model
const UserModel = mongoose.model("User", userSchema)

export default UserModel
