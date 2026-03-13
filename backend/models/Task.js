import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'title is required'],
        trim: true,
        minLength: [3, 'title must be atleast 3 characters'],
        maxLength: [100, 'Name cannot exceed 100 characters']
    },
    description:{
        type: String,
        trim: true,
        maxLength: [500, 'Password must not xceed 500 characters'],
        default: ''
    },
    status:{
        type: String,
        enum: {
            values: ['pending', 'completed'],
            message: 'Status must be either ending or completed'
        },
        default: 'pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Task = mongoose.model('Task',taskSchema);

export default Task;