const validator = require('validator')

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong Password!");
    }
}
const validateProfileEdit = (req) => {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "gender",
      "age",
      "about",
      "skills",
    ];
    const data = req.body;
    const isUpdateAllowed = Object.keys(data).every(
      (field) => allowedEditFields.includes(field)
    );
    return isUpdateAllowed;
}
module.exports = { validateSignUpData, validateProfileEdit };