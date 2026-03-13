import { body, validationResult } from 'express-validator';

const validation = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

export const registerValidate = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min:2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide valid email'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min:6 }).withMessage('Password must be atleast 6 characters'),
    validation
];

export const loginValidate = [
    body('email')
        .trim()
        .notEmpty().withMessage('Invalid email').isEmail().withMessage("Invalid email"),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required'),
    validation
];

export const taskValidate = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min:3, max: 100 }).withMessage('Title must be 3-100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('TDescription cannot exceed 500 characters'),
    body('status')
        .trim()
        .isIn(['pending', 'completed']).withMessage('Status must be pending or completed'),
    validation
];