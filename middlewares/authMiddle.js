const jwt = require("jsonwebtoken");

//auth
const auth = (req, res, next) => {
    try {
        // flag to check if the route is protected
        const { flag } = req.body;
        if (flag==1) {
            const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Access Denied",
                });
            }

            try {
                const decode = jwt.verify(token, process.env.ACCESS_SECRET);
                req.user = decode;
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid Token",
                });
            }
            next();
        } 
        else if(flag==0) next();
        else{
            return res.status(401).json({
                success: false,
                message: "Flag Not Found"
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in Authentication",
        });
    }
};

module.exports = auth;
