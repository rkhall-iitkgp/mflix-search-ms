const {login} = require('./login')
const {signup, sendotp} = require('./signup')
const {updatePasswordOTP, verifyOTPUpdatePassword} = require('./updatePassword');

module.exports = {
    login,
    signup,
    sendotp,
    updatePasswordOTP,
    verifyOTPUpdatePassword
};
