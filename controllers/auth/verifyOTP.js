const bcrypt = require("bcrypt");
const { Account } = require("../../models");
const { client } = require("../../redis");

const verifyOTP = async (req, res) => {
  try {
    const { flag } = req.body;
    // flag == 1 if updatePassword else register user
    if (flag) {
      try {
        const { otp, email, newPassword } = req.body;
        if (!otp)
          return res
            .status(400)
            .json({ success: false, message: "Please enter OTP", code: -1 });

        if (!client.isOpen)
          return res
            .status(500)
            .json({ success: false, message: "Redis client error", code: -4 });
        const secret = await client.get(req.body.email, (err, res) => {
          if (err) console.log(err);
          console.log(res);
        });
        const user = await Account.findOne({ email })
          .select("+password")
          .exec();
        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: "User not found", code: -2 });
        }
        // Verify OTP
        if (otp === secret) {
          // OTP verification successful
          // Proceed with login logic
          bcrypt.hash(newPassword, 10, async (err, hash) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: "Error in hashing password",
                code: -4,
              });
            }
            user.password = hash;
            await user.save();
            return res.status(200).json({
              success: true,
              message: "Password updated successfully",
              code: 0,
            });
          });
          // res.status(200).json({ success: true, message: "OTP verification successful" });
        } else {
          // OTP verification failed
          res
            .status(400)
            .json({ success: false, message: "Invalid OTP", code: -2 });
        }
      } catch (e) {
        res.status(400).json({
          success: false,
          message: "Internal Server Error",
          code: -5,
        });
      }
    } else {
      /*
                    IF YOU ARE IN SIGNUP MODE
                */
      try {
        //get input data
        const {
          name,
          email,
          password,
          phone,
          dob,
          otp,
          password: password2,
        } = req.body;

        // Check if All Details are there or not
        if (!name || !email || !password || !otp || !password2) {
          return res.status(403).send({
            success: false,
            message: "All Fields are required",
          });
        }
        if (password !== password2) {
          return res.status(403).json({
            success: false,
            message: "Password Doesn't Match",
          });
        }
        //check if use already exists?
        const existingUser = await Account.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "User already exists",
          });
        }

        // Find the most recent OTP for the email
        const response = await client.get(req.body.email, (err, res) => {
          if (err) console.log(err);
          console.log(res);
        });

        if (response.length === 0) {
          // OTP not found for the email
          return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
          });
        } else if (otp !== response) {
          // Invalid OTP
          return res.status(400).json({
            success: false,
            message: "The OTP is not valid",
          });
        }

        //secure password
        let hashedPassword;
        try {
          hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: `Hashing pasword error for ${password}: ` + error.message,
          });
        }

        const user = await Account.create({
          name,
          email,
          phone,
          dob,
          password: hashedPassword,
        });

        return res.status(200).json({
          success: true,
          message: "user created successfully ✅",
          user,
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: "User registration failed",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = verifyOTP;
