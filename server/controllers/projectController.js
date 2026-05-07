const Project = require('../models/Project');
const User = require('../models/User');

const Task = require('../models/Task');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res) => {
    try {
        const { projectName, description, members } = req.body;

        if (!projectName) {
            return res.status(400).json({ message: 'Project name is required' });
        }

        const project = new Project({
            projectName,
            description,
            createdBy: req.user.id,
            members: members || []
        });

        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ message: 'Server error creating project' });
    }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
    try {
        // If the user is Admin, they can see all projects.
        // If Member, they should ideally see projects they are a member of, but requirements say "view all projects". 
        // We will fetch all projects and populate necessary fields.
        const projects = await Project.find()
            .populate('createdBy', 'name email')
            .populate('members', 'name email role')
            .sort({ createdAt: -1 });
            
        res.status(200).json(projects);
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ message: 'Server error fetching projects' });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('members', 'name email role');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Get project by id error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(500).json({ message: 'Server error fetching project' });
    }
};

// @desc    Add member to a project
// @route   PUT /api/projects/:id/add-member
// @access  Private/Admin
exports.addMember = async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is already a member
        if (project.members.includes(userId)) {
            return res.status(400).json({ message: 'User is already a member of this project' });
        }

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        project.members.push(userId);
        await project.save();

        res.status(200).json({ message: 'Member added successfully', project });
    } catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({ message: 'Server error adding member' });
    }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        await project.deleteOne();
        
        // Also delete associated tasks
        await Task.deleteMany({ projectId: req.params.id });

        res.status(200).json({ message: 'Project removed' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ message: 'Server error deleting project' });
    }
};
