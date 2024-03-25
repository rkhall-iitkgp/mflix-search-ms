const {login, verify} = require("./login");
const sendOTP = require("./sendOTP");
const verifyOTP = require("./verifyOTP");
const logout = require("./logout");
const {removeActiveLogin, getActiveLogins} = require("./manageLogin")
module.exports = {
    login,
    sendOTP,
    verifyOTP,
    logout,
    removeActiveLogin,
    getActiveLogins, 
    verify
};

