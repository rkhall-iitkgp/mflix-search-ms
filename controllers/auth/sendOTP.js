const { Account } = require("../../models");
const genAndSendOTP = require('./otp')

const sendOTP = async (req, res) => {

    const { type } = req.body;
    if(type==="change"){
        if(!req.headers.authorization) return res.status(401).json({ message: "Error in Authentication", success: false});
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;
        
        const otp = genAndSendOTP(req.user.email);
        return res.status(200).json({ message: "OTP sent successfully", success: true });
    }

    const { email } = req.body;
    const user = await Account.findOne({ email });

    if(type==="register"){
        if(user) return res.status(400).json({ message: "User already exists", success: false});

        const otp = genAndSendOTP(email);
        return res.status(200).json({ message: "OTP sent successfully", success: true });
    }

    if(type==="forgot"){
        if(!user) return res.status(400).json({ message: "User does not exist", success: false});
        const otp = genAndSendOTP(email);
        return res.status(200).json({ message: "OTP sent successfully", success: true});
    }

    return res.status(400).json({ message: "Invalid type", success: false});
}

module.exports = sendOTP;