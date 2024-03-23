const bcrypt = require("bcrypt");
const hotp = require("hotp");

const { Account } = require("../../models");
const { client } = require("../../redis");
const { mailSender } = require("../../utils");

const OTPhelper = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = hotp.totp(email, {
      digits: process.env.OTP_DIGITS,
      timeStep: 300,
    });
    // STORE OTP IN REDIS
    if (!client.isOpen)
      return res
        .status(500)
        .json({ success: false, message: "Redis client error", code: -4 });

    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP </h1>
            <p> here is your OTP code: ${otp} </p>
        `,
    );

    await client.set(
      email,
      otp,
      { EX: process.env.OTP_EXPIRE_TIME },
      (err, res) => {
        if (err) {
          console.log("error in setting redis key", err);
          return res
            .status(500)
            .json({ success: false, message: "Redis client error", code: -4 });
        }
      },
    );
    res.status(200).json({
      success: true,
      message: `OTP Sent Successfully`,
    });
  } catch (error) {
    console.log(error);
  }
};

const sendOTP = async (req, res) => {
  try {
    // flag = 1 if from UpdatePassword else
    // Create OTP
    const { flag } = req.body;
    if (flag) {
      try {
        const { password, newPassword, email } = req.body;
        if (!password || !email) {
          return res.status(400).json({
            success: false,
            message: "Password is required",
            code: -1,
          });
        }

        const user = await Account.findOne({ email })
          .select("+password")
          .exec();
        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: "User not found", code: -2 });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid password", code: -2 });
        }
        // send otp to valid
        const success = await OTPhelper(req, res);
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Error Occured in Authentication ⚠️",
        });
      }
    } else {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the details",
        });
      }
      // Check if user is already present
      // Find user with provided email
      const checkUserPresent = await Account.findOne({ email });
      // to be used in case of signup

      // If user found with provided email
      if (checkUserPresent) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({
          success: false,
          message: `User is already registered`,
        });
      }
      const success = await OTPhelper(req, res);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = sendOTP;
