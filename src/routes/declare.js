const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');

const declareController = require('../app/controllers/DeclareController');


router.get('/progress', Auth.auth, declareController.progress);
router.put('/:code', Auth.auth, declareController.complete);
router.put('/close/:code', Auth.auth, declareController.closeDeclaration);
router.put('/open/:code', Auth.auth, Auth.authA123B1, declareController.openDeclaration);
router.get('/activate', Auth.auth, Auth.authA123B1, declareController.activate);







module.exports = router;
