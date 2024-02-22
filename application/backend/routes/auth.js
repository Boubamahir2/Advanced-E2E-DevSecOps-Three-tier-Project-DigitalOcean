const express = require('express');
const router =  express.Router();
const { register, login, updateUser } = require("../controllers/auth");
const authenticateUser = require("../middleware/authentication");

//we can use another shorter aproach other than router.route('/').post('/register',register)
router.post('/register', register);
router.post('/login', login);
router.route("/updateUser").patch(authenticateUser, updateUser);

module.exports = router;