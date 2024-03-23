const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Account } = require("../../models");

const login = async (req, res) => {
    try {
        //data fetch
        const { email, password } = req.body;
        //validation on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        //check for registered User
        let user = await Account.findOne({ email }).select("+password").exec();
        //if user not registered or not found in database
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };
        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE_TIME,
            });
            let sessionToken = jwt.sign(payload, process.env.SESSION_SECRET, {
                expiresIn: process.env.JWT_EXPIRE_TIME,
            });
            user = user.toObject();
            user.token = token;
            user.sessionToken = sessionToken;
            req.session.sessionToken = sessionToken;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true, //It will make cookie not accessible on clinet side -> good way to keep hackers away
            };
            res.cookie("token", token, "sessionToken", sessionToken, options)
                .status(200)
                .json({
                    success: true,
                    message: "Login successfull",
                    user,
                });
        } else {
            //password donot matched
            return res.status(403).json({
                success: false,
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occured in login",
        });
    }
};

module.exports = login;
