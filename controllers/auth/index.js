const {login, refresh} = require("./login");
const sendOTP = require("./sendOTP");
const verifyOTP = require("./verifyOTP");
const logout = require("./logout");
module.exports = {
    login,
    sendOTP,
    verifyOTP,
    logout,
    refresh, 
};

