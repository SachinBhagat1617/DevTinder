const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const mailhelper = require("../utils/mailHelper");
const crypto = require("crypto");


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.getJwt();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    console.log({ accessToken, refreshToken });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating referesh and access token " +
        error.message
    );
  }
};

const signUp = async (req, res) => {
  try {
    // validation of data  you should throw error because it
    // can be mallicious data and you must protect your db
    validateSignUpData(req);

    // encrypt the password
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    // creating new instance of the model
    const { firstName, lastName, emailId, age } = req.body;
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
    });
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: `${error.message} ` });
  }
};
const userUpdate = async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body; // data will be javaScript Object in key value pair since app.use(express.json()) converts json into javascript object to iterate

  try {
    // inside try catch async code and if you want to throw error only that code is written
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    console.log(Object.keys(data)); // [ 'userId', 'age', 'skills' ]
    console.log(Object); //[Function: Object]
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    ); //Object.keys(data)->Returns the names of the enumerable string properties and methods of an object.
    if (!isUpdateAllowed) {
      throw new Error("Parameter not allowed to update"); // since we are throwing an error then it should be in try catch block
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after", // Returns updated document
      runValidators: true, // to run the validator before updating
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.json({ success: true, message: "User updated Successfully" });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: `Update Failed: ${error.message}`,
    });
    return; // Stop execution after sending response
  }
};

const logIn = async (req, res) => {
  const { emailId, password } = req.body;
  console.log({ emailId, password });
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const hashPassword = user.password;
    const check = await bcrypt.compare(password, hashPassword);
    if (check) {
      //s1 for create a JWT token
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );
      //console.log({ accessToken, refreshToken });
      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };
      //s2 Add the token to cookie and send the cookie to the user
      res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);
      res.status(200).json({
        success: true,
        loggedInUser,
      });
      return;
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      res.status(401).json({
        success: false,
        message: "refreshToken not found",
      });
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_ACCESS_TOKEN_SECRET
    );
    console.log(decodedToken);

    const user = await User.findById(decodedToken?._id);
    // console.log(user)
    if (!user) {
      throw new Error("Invalid Refresh Token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new Error("Refresh token is expired or used");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    //console.log({ accessToken, refreshToken });
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options);
    res.status(200).json({
      success: true,
      loggedInUser,
    });
    return; // Stop execution after sending response
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
    return; //  Stop execution after sending response
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(Date.now()) });
    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { emailId } = req.body;
    if (!emailId) {
      throw new Error("Please provide email address");
    }
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    //console.log(user.firstName);
    const forgotToken = await user.getForgotPasswordToken(); // raw Token
    await user.save();

    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`; // req.protocol ->http/https
    const message = `Copy paste this link in your URL and hit Enter \n\n ${myUrl}`;
    //sending an email is tricky one  so wrap in try catch block specially error part
    //console.log(message);
    console.log(process.env.SMTP_HOST);
    await mailhelper({
      email: user.emailId,
      subject: "DevTinder Password reset email",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const passwordReset = async (req, res) => {
  try {
    const token = req.params.token;

    if (!token) {
      throw new Error("Token not found from URL");
    }
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      forgotPasswordToken: hashToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("User not found or token Invalid or Expired");
    }
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      throw new Error("newPassword and confirmPassword doesnot matches");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password Changed",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = req.user;
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      throw new Error("Password not matched");
    }
    const hashPassword = await bcrypt.hash(confirmPassword, 10);
    user.password = hashPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password changed!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  signUp,
  userUpdate,
  logIn,
  logout,
  forgotPassword,
  passwordReset,
  updatePassword,
  refreshAccessToken
};
