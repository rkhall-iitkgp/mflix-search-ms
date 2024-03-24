const jwt = require("jsonwebtoken");

//auth
const auth = (req, res, next) => {
    try {
        // flag to check if the route is protected
        const { flag } = req.body;
        if (flag) {
            const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Access Denied",
                });
            }

            try {
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                req.user = decode;
                console.log(req.user);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Token",
                });
            }
            next();
        } 
        else next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in Authentication"
        });
    }
};

module.exports = auth;
