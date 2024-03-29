const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Account, ActiveLogin } = require("../../models");

const verify = async (req, res) => {
    try {
        let token = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.clearCookie("accessToken");
            return res.status(401).json({
                success: false,
                message: "No refresh token provided",
            });
        }
        if (!token) {
            const refreshResponse = await refresh(refreshToken);
            if (!refreshResponse.success) {
                res.clearCookie("refreshToken");
                return res.status(401).json({
                    success: false,
                    message: refreshResponse.message,
                });
            }
            token = refreshResponse.token;
            res.cookie("accessToken", token, {
                expires: new Date(Date.now() + 60 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
        }
        const payload = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = payload;

        const account = await Account.findById(req.user.id)
            .populate({
                path: "subscriptionTier",
                populate: { path: "tier", model: "tiers" },
            })
            .populate({
                path: "subscriptionTier",
                populate: { path: "bill", model: "payments" },
            })
            .exec();

        if (!account) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Token verified",
            account: account,
        });
    } catch (error) {
        console.error(error);
        res.clearCookie("refreshToken");
        res.clearCookie("accessToken");
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

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
        let user = await Account.findOne({ email }).select("+password").populate({path: "subscriptionTier", populate: {path: "tier", model: "tiers"}}).populate({path: "userProfiles", model: "users"}).exec();
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        let token = jwt.sign(payload, process.env.ACCESS_SECRET, {
            expiresIn: process.env.ACCESS_EXPIRE_TIME,
        });
        let refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
            expiresIn: process.env.REFRESH_EXPIRE_TIME,
        });
        user = user.toObject();

        const activeLogin = {
            account: user._id,
            loginTime: new Date(),
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            sessionId: refreshToken,
        };

        const activeLoginInstance = new ActiveLogin(activeLogin);
        await activeLoginInstance.save();

        user.activeLogins.push(activeLoginInstance._id);
        await Account.findByIdAndUpdate(user._id, user).exec();

        user.password = undefined;

        res.cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true,
            secure: true, 
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
            account: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error occured in login",
        });
    }
};

module.exports = { login, verify };
