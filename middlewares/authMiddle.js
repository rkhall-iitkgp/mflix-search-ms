const jwt = require('jsonwebtoken')

//auth
const auth = (req,res,next)=>{
    try {
        //extract JWT token
        // flag = 1 if from UpdatePassword else 
        const { flag } = req.body
        if(flag){
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
        }
        else next()
            
        } catch (error) {
            return res.status(401).json({
                success:false,
                message: "Error Occured in Authentication ⚠️"
            })
        }
    }
    

module.exports = auth