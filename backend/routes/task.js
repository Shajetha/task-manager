import express from 'express';
import { newTask, allTasks, getTask, updateTask, deleteTask, taskStats } from '../controllers/taskController.js';
import { taskValidate } from '../middleware/validate.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', taskStats);
router.route('/')
    .get(allTasks)
    .post(taskValidate, newTask);

router.route('/:id')
    .get(getTask)
    .put(taskValidate, updateTask)
    .delete(deleteTask);

const taskRoutes = router;

export default taskRoutes;