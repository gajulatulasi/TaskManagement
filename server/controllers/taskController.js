const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, projectId, dueDate, priority } = req.body;

        if (!title || !assignedTo || !projectId) {
            return res.status(400).json({ message: 'Title, Assigned To, and Project are required' });
        }

        // Verify project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = new Task({
            title,
            description,
            assignedTo,
            projectId,
            dueDate,
            priority: priority || 'Medium'
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error creating task' });
    }
};

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        let query = {};
        
        // If user is a Member, only return their assigned tasks
        if (req.user.role === 'Member') {
            query.assignedTo = req.user.id;
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('projectId', 'projectName')
            .sort({ dueDate: 1, createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error fetching tasks' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Member logic: can only update status if it's assigned to them
        if (req.user.role === 'Member') {
            if (task.assignedTo.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Not authorized to update this task' });
            }
            
            // Allow updating ONLY the status
            if (req.body.status) {
                task.status = req.body.status;
                await task.save();
                return res.status(200).json(task);
            } else {
                return res.status(400).json({ message: 'Members can only update task status' });
            }
        }

        // Admin logic: can update anything
        if (req.user.role === 'Admin') {
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            )
            .populate('assignedTo', 'name email')
            .populate('projectId', 'projectName');
            
            return res.status(200).json(updatedTask);
        }

    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error updating task' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task removed' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error deleting task' });
    }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('projectId', 'projectName');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Optional: restrict Member access if not assigned to them
        if (req.user.role === 'Member' && task.assignedTo._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this task' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Get task by id error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(500).json({ message: 'Server error fetching task' });
    }
};
