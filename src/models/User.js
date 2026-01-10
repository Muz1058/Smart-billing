"use strict"

const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            minLength:5,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,    
            trim:true,
            match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/           

        },
        password:{
            type:String,
            required:[true,"Password is required"],
            minLength:8,
            match:[/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Password must contain at least one letter and one number"],
            select:false,

        },
        refreshToken:{
            type:String,
            select:false,
        }
    },
    {timestamps:true}

)

userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.generateAccessToken=function(){
    return jwt.sign(
        {id:this._id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"}
    )
}