const jwt = require('jsonwebtoken')
require('dotenv').config()

//auth
exports.auth = (req,res,next)=>{
    try {
        //extract JWT token
        const token =
		req.headers.authorization && req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            })
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            console.log(req.user)
        } catch (error) {
            return res.status(401).json({
                success:false,
                message: "invalid Token ⚠️"
            })
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success:false,
            message: "Error Occured in Authentication ⚠️"
        })
    }
}

