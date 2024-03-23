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

        if (!client.isOpen)
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Redis client error",
                    code: -4,
                });

        await mailSender(
            email,
            "Verification Email",
            `<h1>Please confirm your OTP </h1>
            <p> Here is your OTP code: ${otp} </p>`,
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
                        .json({
                            success: false,
                            message: "Redis client error",
                            code: -4,
                        });
                }
            },
        );
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
        });
    } catch (error) {
        console.log(error);
    }
};

const sendOTP = async (req, res) => {
    try {
        // flag is 1 for change password
        const { flag } = req.body;
        if (flag) {
            try {
                const { password, email } = req.body;
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
                        .json({
                            success: false,
                            message: "User not found",
                            code: -2,
                        });
                }

                const validPassword = await bcrypt.compare(
                    password,
                    user.password,
                );
                if (!validPassword) {
                    return res
                        .status(400)
                        .json({
                            success: false,
                            message: "Invalid password",
                            code: -2,
                        });
                }

                const success = await OTPhelper(req, res);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "Error Occured in Authentication",
                });
            }
        } else {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({
                    success: false,
                    message: "Please fill email field",
                });
            }
            const checkUserPresent = await Account.findOne({ email });

            if (checkUserPresent) {
                return res.status(401).json({
                    success: false,
                    message: "User already registered with this email",
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
