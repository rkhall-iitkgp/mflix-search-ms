const bcrypt = require('bcrypt')
const {User} = require("../../models")
const jwt= require('jsonwebtoken')
const hotp = require( 'hotp' )
const redis = require('redis');
const { client } = require("../../redis");
const {mailSender} = require('../../utils')
require('dotenv').config()

exports.updatePasswordOTP = async (req, res) => {
	console.log(req)
	try {
		const { password, newPassword, email} = req.body;
		if (!password || !newPassword || !email) {
			return res.status(400).json({
				success: false,
				message: "Password and New Password are required",
				code: -1,
			});
		}
        console.log(password, newPassword, email)
		const user = await User.findOne({email})
			.select("+password")
			.exec();
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "User not found", code: -2 });
		}
        console.log(password, " ", user)
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid password", code: -2 });
		}
        // send otp to valid
        console.log(validPassword)
        const otp = hotp.totp(process.env.OTP_KEY, { digits: process.env.OTP_DIGITS });
        // STORE OTP IN REDIS
		if (!client.isOpen)
			return res
				.status(500)
				.json({ success: false, message: "Redis client error", code: -4 });
        console.log(otp)
        
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            `<h1>Please confirm your OTP </h1>
                <p> here is your OTP code:-> ${otp} </p>
            `
        );
        console.log("Email sent successfully: ", mailResponse);
      
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
                            console.log('OTP stored in Redis for user', email);
                            console.log(res);
                        }
                    );
        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });

		
	} catch (e) {
		console.error(e);
		return res
			.status(500)
			.json({ success: false, message: "Internal Server Error", code: -5 });
	}
};

exports.verifyOTPUpdatePassword = async (req, res) => {
	try {
		const { otp, email, newPassword } = req.body;
		if (!otp)
			return res
				.status(400)
				.json({ code: -1, success: false, message: "Please enter OTP" });
        
		if (!client.isOpen)
			return res
				.status(500)
				.json({ success: false, message: "Redis client error", code: -4 });
		const secret = await client.get(req.body.email, (err, res) => {
			if (err) console.log(err);
			console.log(res);
		});
        const user = await User.findOne({email})
			.select("+password")
			.exec();
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "User not found", code: -2 });
		}
		// Verify OTP	
		if (otp===secret) {
			// OTP verification successful
			// Proceed with login logic
			bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
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
			error: e.message,
			code: -5,
		});
	}
};
