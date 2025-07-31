const express = require('express');
const router = express.Router();
// Import the loginhandler from authController
const { loginhandler,profilehandler, registerhandler,getallUsers,roleUpdateHandler,deleteUser } = require('../controllers/authController');
const verifyjwt = require('../middleware/jwtverify');
//register
router.post('/register',registerhandler)
// Define the POST route for /login
router.post('/login', loginhandler);
//profile
router.get('/profile/:id',verifyjwt, profilehandler)
router.get('/allusers',verifyjwt,getallUsers)
router.put('/role/:id',verifyjwt,roleUpdateHandler)
router.delete(`/delete/:id`,deleteUser)
module.exports = router;
