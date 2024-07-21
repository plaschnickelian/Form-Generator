const express = require('express');
const { protectUser } = require('../middleware/authMiddleware')
const userController = require('../controllers/loginController')
const clientManagement = require('../controllers/objectController');
const formPageController = require('../controllers/formPageController');
const { modelMiddleware } = require('../middleware/modelMiddleware');

const router = express.Router()

router.post('/login', userController.loginUser)
router.route('/profile').get(protectUser, userController.getUserProfile)

//user datenerfassung
router.post('/data/getObject/:id', [protectUser, modelMiddleware], clientManagement.getObject)
router.post('/data/getObject', [protectUser, modelMiddleware], clientManagement.getAllObjects)
router.post('/data/listObjects', [protectUser, modelMiddleware], clientManagement.listAllObjects)
router.post('/data/getFormPageObject/:id', [protectUser, modelMiddleware], formPageController.getFormPageObject);

//create
router.post('/data/object', [protectUser, modelMiddleware], clientManagement.createObject)
router.post('/data/formPageObject', [protectUser, modelMiddleware], formPageController.updateFormPageObject);

//update
router.put('/data/object/:id', [protectUser, modelMiddleware], clientManagement.updateObject)

//delete
router.delete('/data/object/:id', [protectUser, modelMiddleware], clientManagement.deleteObject)

module.exports = router