const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(401).json({
                success: false,
                message: "Error in Authentication",
            });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;
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
