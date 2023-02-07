import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'please provide name'],
        minlength:3,
        maxlength:20,
        trim: true,
    },
    email: {
        type: String,
        required: [true,'please provide email'],
        unique:true,
        validate:{
            validator: validator.isEmail,
            message:'please provide a valid email'
        }
    },
    password: {
        type: String,
        required: [true,'please provide password'],
        minlength:6,
        select:false,
    },
    lastName: {
        type: String,
        trim:true,
        maxlength:20,
        default: 'lastname',
    },
    location: {
        type: String,
        trim:true,
        maxlength:20,
        default: 'my city',
    },
})

UserSchema.pre('save',async function() {
    console.log(this.modifiedPaths());
    console.log(this.isModified("password"));
    console.log("entered save");
    if(this.isModified("password") === true){ // if we are not modifiying the password
        // console.log("modified the password");
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt)
    }
    //OR
    // !this.modifiedPaths("password") return
    // const salt = await bcrypt.genSalt(10);
    // this.password = await bcrypt.hash(this.password,salt)
    
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({ userId:this._id }, process.env.JWT_SECRET,{expiresIn: process.env.JWT_LIFETIME })
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}
export default mongoose.model('User',UserSchema)