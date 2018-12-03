var express = require('express');
var router = express.Router();

// Require the controllers
var controller = require('../controllers/ControllerApi');


// a simple test url to check that all of our files are communicating correctly.
router.get('/test', controller.test);

router.post('/create/friend', controller.create_friend);

router.get('/get/list/friend', controller.get_list_friend);

router.get('/get/list/secret/friend', controller.get_list_secret_friend);

router.get('/get/secret/friend/:id', controller.get_secret_friend);

router.delete('/delete/friend/:id', controller.friend_delete);


module.exports = router;