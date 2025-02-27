require("dotenv").config();

const express = require("express");
const app = express(); // create an instance of express

const DBconnect = require("./src/config/database");
const User = require("./src/models/user");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
app.use(express.json()); //: This middleware is added to handle incoming requests that have a JSON body
//(such as POST requests where data is being sent to the server). It converts the raw JSON data in the
//request body into a JavaScript object, so you can easily access and manipulate the data in your route handlers.
/* Note: Without this middleware, req.body would be empty or undefined, as Express doesn't automatically parse the body of requests for JSON.*/
app.use(morgan("tiny"));
app.use(cookieParser()); // to read the cookies

// import all toutes here
const auth = require("./src/router/auth");
const profile = require("./src/router/profile");
const request = require("./src/router/requests")
const user=require("./src/router/user")
app.use("/api/v1", auth);
app.use("/api/v1", profile);
app.use("/api/v1", request);
app.use("/api/v1", user);
app.use("/", (req, res) => {
  res.send("Namaste Sachin");
});

// always first connect to DB then to the server
// IIFE function
const connect = (async () => {
  try {
    // Wait for DB connection
    await DBconnect();
    // Start server if DB connection is successful
    app.listen(7777, () => {
      console.log("Server started to listen on port no 7777");
    });
  } catch (error) {
    console.log("Failed to connect to the database:", error);
  }
})();
