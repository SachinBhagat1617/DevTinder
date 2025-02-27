const express = require('express');
const userAuth = require('../middleware/userAuth');
const {
  interestedConnectionReceived,
  getConnection,
  getFeed,
} = require("../controller/userController");
const router = express.Router();

router.get("/user/requests/received", userAuth, interestedConnectionReceived);  // gives the list of all connection request to user
router.get("/user/connections", userAuth, getConnection);
router.get('/user/feed',userAuth,getFeed)
module.exports = router;