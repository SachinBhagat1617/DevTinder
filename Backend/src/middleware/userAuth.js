const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies; // note here use cookies but while sending response use res.cookie
    const { token } = cookies;
    // console.log(token);
    if (!token) {
      throw new Error("LogIn again Token not found");
    }

    const decodedMessage = await jwt.verify(token, "thisIsMySecretKey");

    // console.log(decodedMessage);
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not Found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = userAuth;
