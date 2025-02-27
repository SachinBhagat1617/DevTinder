const { randomBytes } = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: [30, "firstName should be of atmost 30 characters"],
    },
    lastName: {
      type: String,
      max: [30, "firstName should be of atmost 30 characters"],
    },
    emailId: {
      type: String,
      unique: true,
      required: true,
      lowercase: true, //Always convert `emailID` to lowercase
      validate: {
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email",
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: [18, "Age must be above 18"],
      required: true,
    },
    gender: {
      //enum:["Male","Female","Others"],
      type: String,
      enum: {
        values: ["Male", "Female", "Others"],
        message: "{VALUE} is not supported",
      },
    },
    photUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZgsseD7fHMEp6rJolv_Z7Moibq5pAzQ0nFOdN-KXw1jnbEdf3kLYbuG0pEd0_ceaO7WU&usqp=CAU",
    },
    about: {
      type: String,
      default: "Hii Everyone , I am a Developer",
    },
    skills: {
      type: [String],
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);
// don't write arrow fn here because you are using this keyword which will give you error
userSchema.methods.getJwt = async function () {
  const token = await jwt.sign({ _id: this._id }, "thisIsMySecretKey", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.getForgotPasswordToken = async function () {
  const forgotToken = crypto.randomBytes(10).toString("hex");
  // has the token
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  //time of token
  this.forgotPasswordExpiry = Date.now() + 10 * 60 * 1000; // valid till 10min 
  return forgotToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
