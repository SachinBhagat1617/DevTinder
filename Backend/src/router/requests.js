const { sendConnectionRequest, reviewConnectionRequest } = require("../controller/requestController");
const userAuth = require("../middleware/userAuth");

const express = require("express")
const router = express.Router();

router.post("/request/send/:status/:toUserId", userAuth, sendConnectionRequest);
router.post(
  "/request/review/:status/:requestId",
  userAuth,
  reviewConnectionRequest
);
module.exports = router;