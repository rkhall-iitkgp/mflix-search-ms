const bcrypt = require('bcrypt')
const {User} = require("../../models")
const jwt= require('jsonwebtoken')
const hotp = require( 'hotp' )
const redis = require('redis');
const { client } = require("../../redis");
const {mailSender} = require('../../utils')
require('dotenv').config()
//signup handle
exports.signup = async(req, res)=> {
    try {
        //get input data
        const {name, email, password, phoneNumber, dob, otp, password2}= req.body
        
        // Check if All Details are there or not
		if (!name ||
			!email ||
			!password ||
			!otp || !password2
		) {
			return res.status(403).send({
				success: false,
				message: "All Fields are required",
			});
		}
        if(password !== password2){
            return res.status(403).json({
                success: false,
                message: "Password Doesn't Match"
            })
        }
        //check if use already exists?
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // Find the most recent OTP for the email
		const response = await client.get(req.body.email, (err, res) => {
			if (err) console.log(err);
			console.log(res);
		});

		console.log("Latest OTP", response);
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
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password,10)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message : `Hashing pasword error for ${password}: `+error.message
            })
        }

        const user = await User.create({
            name, email, phoneNumber, dob, password:hashedPassword
        })

        return res.status(200).json({
            success: true,
            user,
            message: "user created successfully ✅"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message : "User registration failed"
        })
    }
}

exports.sendotp = async (req, res) => {
	try {
		const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Plz fill all the details"
            })
        }
		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}
        // Create OTP
		const otp = hotp.totp(
            process.env.OTP_KEY,
            { 
                digits: process.env.OTP_DIGITS,
                timeStep: 300
            }    
        );
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


        
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};