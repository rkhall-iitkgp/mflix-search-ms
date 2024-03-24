const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Account } = require("../../models");

const refresh = async(req, res)=>{

    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(403).json({
                success: false,
                message: "No refresh token provided",
            });
        }
        let payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        let user = await Account.findOne({ email: payload.email }).exec();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        const newPayload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };
        let token = jwt.sign(newPayload, process.env.ACCESS_SECRET, {
            expiresIn: process.env.ACCESS_EXPIRE_TIME,
        });
        user = user.toObject();
        user.accessToken = token;
        user.password = undefined;
        res.status(200).json({
            success: true,
            message: "Token refreshed",
            user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occured in refresh",
        });
    }
}


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
            let token = jwt.sign(payload, process.env.ACCESS_SECRET, {
                expiresIn: process.env.ACCESS_EXPIRE_TIME,
            });
            let refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
                expiresIn: process.env.REFRESH_EXPIRE_TIME,
            });
            user = user.toObject();
            user.accessToken = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true, //cookie cannot be accessed by client side script
            };
            res.cookie("refreshToken", refreshToken, options);
            res.status(200).json({
                success: true,
                message: "Login successful",
                user,
            });
        } 
        else {
            res.status(401).json({
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
