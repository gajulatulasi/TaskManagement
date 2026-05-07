const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { 
    createTask, 
    getTasks, 
    updateTask, 
    deleteTask,
    getTaskById
} = require('../controllers/taskController');

// Routes
router.post('/', protect, authorizeRoles('Admin'), createTask);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteTask);

module.exports = router;
