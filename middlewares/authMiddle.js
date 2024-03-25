const jwt = require("jsonwebtoken");
const { ActiveLogin } = require("../models");

const refresh = async(refreshToken) => {

    try {
        let payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        let user = await Account.findOne({ email: payload.email }).exec();
        if (!user) {
            return {
                success: false,
                message: "User not found",
            };
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
        user.password = undefined;
        return {
            success: true,
            message: "Token refreshed",
            "account":user,
            token: token
        };
    }
    catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error occured in refresh",
        };
    }
}  

const auth = async(req, res, next) => {
    try {
        let token = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            res.clearCookie('accessToken');
            return res.status(401).json({
                success: false,
                message: "No refresh token provided",
            });
        }

        if(!token){
            const refreshResponse = await refresh(refreshToken);
            if(!refreshResponse.success){
                res.clearCookie('refreshToken');
                return res.status(401).json({
                    success: false,
                    message: refreshResponse.message,
                });
            }

            res.cookie("accessToken", refreshResponse.token, {
                expires: new Date(Date.now() + 60 * 60 * 1000),
                httpOnly: true,
                secure: process.env.DEPLOYMENT === "local" ? false : true,
            });

            token = refreshResponse.token;
        }


        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;
        console.log(req.user, refreshToken, token);
        const activeLoginInstance = await ActiveLogin.findOne({ sessionId: refreshToken, account: req.user.id }).exec();

        if(!activeLoginInstance){
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(401).json({
                success: false,
                message: "Active login session not found",
            });
        }

        next();
    } 
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in Authentication",
        });
    }
};

module.exports = auth;
