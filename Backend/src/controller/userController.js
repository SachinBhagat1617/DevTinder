const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
const interestedConnectionReceived = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    if (!loggedInUserId) {
      throw new Error("User not authorised");
    }
    const data = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "emailId",
      "age",
      "photoUrl",
      "skills",
      "about",
      "gender",
    ]);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getConnection = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    if (!loggedInUserId) {
      throw new Error("User not Authorised");
    }
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "photoUrl",
        "skills",
        "about",
        "gender",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "emailId",
        "age",
        "photoUrl",
        "skills",
        "about",
        "gender",
      ]);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: "false",
      message: error.message,
    });
  }
};

// const getFeed = async (req, res) => {
//   try {
//       const loggedInUserId = req.user._id;
//       if (!loggedInUserId) {
//           throw new Error("User not authorised")
//       }
//     const allUser = await User.find({});
//     //res.send(allUser);
//     const excludeUser = await ConnectionRequest.find({
//       $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
//     });

//       const excludeUserId = excludeUser.map((user) => {
//           if (user.fromUserId.toString() !== loggedInUserId.toString()) {
//               return user.fromUserId.toString();
//           } else {
//               return user.toUserId.toString();
//           }
//       })
//       excludeUserId.push(loggedInUserId.toString());
//       //res.send(excludeUserId);
//       const userFeed = allUser.filter((user) =>
//         !excludeUserId.includes(user._id.toString())
//       );
//       res.status(200).json({
//         success: true,
//         userFeed,
//       });

//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const getFeed = async (req, res) => {
  const loggedInUserId = req.user._id;
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;

  limit = limit > 50 ? 10 : limit; // data sanitation if any user enter 1000000 then it will fetch 100000 user which will slow down the server
  console.log(limit);
  const skip = (page - 1) * limit;
  
  if (!loggedInUserId) {
    throw new Error("User not authorised");
  }
  const hashSet = new Set();
  const excludeUser = await ConnectionRequest.find({
    $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
  }).select("fromUserId toUserId"); // select necessary attributes only
  excludeUser.forEach((user) => {
    hashSet.add(user.fromUserId);
    hashSet.add(user.toUserId);
  });
  //console.log(hashSet)
  const userFeed = await User.find({
    $and: [
      { _id: { $nin: Array.from(hashSet) } }, // nin => not in
      { _id: { $ne: loggedInUserId } },
    ],
  })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);
  res.status(200).json({
    success: true,
    userFeed,
  });
};

module.exports = { interestedConnectionReceived, getConnection, getFeed };
