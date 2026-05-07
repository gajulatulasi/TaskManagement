const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { 
    createProject, 
    getProjects, 
    getProjectById, 
    addMember,
    deleteProject
} = require('../controllers/projectController');

// Routes
router.post('/', protect, authorizeRoles('Admin'), createProject);
router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.put('/:id/add-member', protect, authorizeRoles('Admin'), addMember);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteProject);

module.exports = router;
