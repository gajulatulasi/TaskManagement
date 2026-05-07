const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        let taskQuery = {};
        let projectQuery = {};

        // Apply role-based filtering
        if (req.user.role === 'Member') {
            taskQuery.assignedTo = req.user.id;
            projectQuery.members = req.user.id;
        }

        const currentDate = new Date();

        // Count totals
        const totalTasks = await Task.countDocuments(taskQuery);
        const totalProjects = await Project.countDocuments(projectQuery);

        // Count by status
        const completedTasks = await Task.countDocuments({ ...taskQuery, status: 'Done' });
        const pendingTasks = await Task.countDocuments({ ...taskQuery, status: { $ne: 'Done' } });

        // Count overdue: dueDate < currentDate AND status != 'Done'
        // Only count if dueDate exists
        const overdueTasks = await Task.countDocuments({
            ...taskQuery,
            dueDate: { $lt: currentDate, $ne: null },
            status: { $ne: 'Done' }
        });

        // Get 5 most recent tasks
        const recentTasks = await Task.find(taskQuery)
            .populate('assignedTo', 'name')
            .populate('projectId', 'projectName')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            stats: {
                totalTasks,
                completedTasks,
                pendingTasks,
                overdueTasks,
                totalProjects
            },
            recentTasks
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats' });
    }
};
