const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const sendConnectionRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Status not allowed");
    }
    // data Sanitation
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error("toUser not found");
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      throw new Error("request already existed");
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    return res.status(200).json({
      success: true,
      message: `${req.user.firstName} ${status} in ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const reviewConnectionRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const allowedStatus = ["accepted", "rejected"];
    const status = req.params.status;
    const requestId = req.params.requestId;
    console.log(loggedInUserId);
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status");
    }
    // data sanitation only interested user can make accept or reject
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUserId,
      status: "interested",
    });
      
    if (!connectionRequest) {
      throw new Error("connectionRequest not found");
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      res.status(200).json({
        success: true,
        message: "connectionRequest staus updated succesfully",
        data: connectionRequest,
      });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { sendConnectionRequest, reviewConnectionRequest };
