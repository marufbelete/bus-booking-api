const express = require('express');
const { saveUser } = require('../controllers/user.controller');
const { loginUser } = require('../controllers/user.controller');
const router = express.Router();

router.post('/register', saveUser)

router.post('/login', loginUser)


module.exports = router

