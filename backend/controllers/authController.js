import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const tokenGenerate = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES || '7d'
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne ({ email });
        if(userExists){
            return res.status(409).json({
            success: false,
            message: "Email already registerd. Try login."
            });
        }

        const user = await User.create({ name, email, password });
        const token = tokenGenerate(user._id);

        return res.status(200).json({
            success: true,
            message: "Registration successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch( error ) {
        console.error('Registration error:',error);
        return res.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne ({ email }).select('+password');
        if(!user){
            return res.status(401).json({
            success: false,
            message: "Invalid email or password."
            });
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
            success: false,
            message: "Invalid email or password."
            });
        }

        const token = tokenGenerate(user._id);

        res.json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch( error ) {
        console.error('Login error:',error);
        return res.status(500).json({
            success: false,
            message: "Server Error."
        });
    }
};

export const self = async (req,res ) => {
    res.json({
        success: true,
        user: {
            id: req._id,
            name: req.name,
            email: req.email,
            createdAt: req.createdAt
        }
    });
}