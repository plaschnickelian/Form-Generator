const express = require('express');
const router = express.Router();
const userManagement = require('../controllers/userController.js');
const projectManagement = require('../controllers/projectController.js');
const { protectAdmin } = require('../middleware/authMiddleware.js');

router.get('/api/users', protectAdmin, userManagement.listUsers)

router.get('/api/users/:mail', protectAdmin, userManagement.listUsers)

router.put('/api/users/:id', protectAdmin, userManagement.updateUsers)

router.delete('/api/users/:id', protectAdmin, userManagement.deleteUsers)

router.post('/api/users', protectAdmin, userManagement.createUsers)

//admin project management routes
router.get('/api/projects', protectAdmin, projectManagement.listProjects)
router.put('/api/projects/:id', protectAdmin, projectManagement.updateProjects)
router.delete('/api/projects/:id', protectAdmin, projectManagement.deleteProjects)
router.post('/api/projects', protectAdmin, projectManagement.createProjects)

//admin projecttype management routes
router.get('/api/projecttypes', protectAdmin, projectManagement.listProjectTypes)

//admin offerType management routes
router.get('/api/projectOfferType', protectAdmin, projectManagement.listProjectOfferTypes)
router.post('/api/projectOfferType', protectAdmin, projectManagement.createProjectOfferType)
router.delete('/api/projectOfferType/:id', protectAdmin, projectManagement.deleteProjectsOfferType)
router.put('/api/projectOfferType/:id', protectAdmin, projectManagement.updateProjectsOfferType);


module.exports = router