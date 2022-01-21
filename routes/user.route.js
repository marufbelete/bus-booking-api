const express = require('express');
const { saveMobileUser } = require('../controllers/user.controller');
const { loginUser } = require('../controllers/user.controller');
const userauth = require("../middleware/auth.middleware")
const router = express.Router();

router.post('/registermobileuser', saveMobileUser)
router.post('/registermobileuser',userauth ,saveMobileUser)

router.post('/login', loginUser)


module.exports = router

