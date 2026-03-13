import Task from '../models/Task.js';

//new task creation
export const newTask = async (req, res) => {
    try{
        const { title, description, status } = req.body;
    
        const task = await Task.create({
            title,
            description: description || '',
            status: status || 'pending',
            userId: req.user._id
        });

        res.status(200).json({
            success: true,
            message: 'Task created successfully',
            task
        });
    } catch(error) {
        console.error('Task not created',error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

//get all tasks
export const allTasks = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = parseInt(req.query.search) || '';
        const status = parseInt(req.query.status) || '';
        const skip = (page - 1) * limit;

        const query = { userId: req.user._id};       //query object

        //search by title, description
        if(search){      
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        //filter by status
        if(status && ['pending', 'completed'].includes(status)){
            query.status = status;
        }

        //execute query
        const tasks = await Task.find(query)
            .sort({cretedAt: -1})  //recently added
            .skip(skip)
            .limit(limit);

        const taskCount = await Task.countDocuments(query);     //get task count

        const totalPages = Math.ceil( taskCount / limit);

        res.status(200).json({
            success: true,
            tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalTasks: taskCount,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        });
    } catch(error) {
        console.error('Cannot fetch tasks: ',error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

//get a specific task
export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, userId: req.user._id});

        if(!task){
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, task });
    } catch(error) {
        if(error.name === 'CastError') {
            return res.status(404).json({ success: false, message: 'Invalid Task ID' });
        }
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

//update task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );

        if(!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({
            success: true,
            message: 'Task Updated successfully',
            task
        });
    } catch(error) {
        if(error.name === 'CastError') {
            return res.status(404).json({ success: false, message: 'Invalid Task ID' });
        }
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

//delete task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if(!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({
            success: true,
            message: 'Task Deleted successfully',
        });
    } catch(error) {
        if(error.name === 'CastError') {
            return res.status(404).json({ success: false, message: 'Invalid Task ID' });
        }
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

//task statics
export const taskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
 
    const result = { total: 0, pending: 0, completed: 0 };
    stats.forEach(s => {
      result[s._id] = s.count;
      result.total += s.count;
    });
 
    res.json({ success: true, stats: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};