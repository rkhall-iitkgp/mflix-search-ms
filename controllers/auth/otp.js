const hotp = require("hotp");

const { client } = require("../../redis");
const { mailSender } = require("../../utils");

const genAndSendOTP = async(email) => {

    const otp = hotp.totp(email, {
        digits: process.env.OTP_DIGITS,
        timeStep: 300,
    });

    if (!client.isOpen) return false;

    await mailSender(
        email,
        "Verification Email",
        `<h1>Please confirm your OTP </h1>
        <p> Here is your OTP code: ${otp} </p>`,
    );

    await client.set(
        email,
        otp,
        {EX: process.env.OTP_EXPIRE_TIME},
        (err, res) => {
            if (err) {
                console.log("error in setting redis key", err);
                return false;
            }
        },
    );

    return true
};

module.exports = genAndSendOTP;
