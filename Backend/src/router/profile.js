const express = require('express');
const userAuth = require('../middleware/userAuth');
const { getUser, editProfile } = require('../controller/profileController');
const router = express.Router();

router.get("/getUser", userAuth, getUser);
router.patch("/editProfile", userAuth, editProfile);
module.exports = router;