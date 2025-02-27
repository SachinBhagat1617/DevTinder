const { validateProfileEdit } = require("../utils/validation");

const getUser = async (req, res) => {
  try {
    const user = req.user; // from middleware
    console.log("hello");
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const editProfile = async (req, res) => {
    try {
        if (validateProfileEdit(req)) {
            const user = req.user;
            //console.log(user);
            Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
            await user.save();
            res.status(200).json({
                success: true,
                message:`${user.firstName} your profile is updated`
            })
        } else {
            throw new Error("Parameter is non editable")
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = { getUser, editProfile };
