import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [2, 'Name must be atleast 2 characters'],
        maxLength: [50, 'Name cannot exceed 50 characters']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter valid Email']
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be atleast 8 characters long'],
        select: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
});

//hash password before saving to DB
userSchema.pre('save', async function (next){
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//compare hashed password with entered password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//remove password from JSON output
userSchema.methods.toJSON = function (){                  
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User',userSchema);

export default User;