const { Account } = require("../../models");
const genAndSendOTP = require("./otp");
const jwt = require("jsonwebtoken");
const { client } = require("../../redis");


const resendOTP = async (req, res) => {

    try{
        let email = req.body.email || req.user.email;
        if(!email) return res.status(400).json({message: "Invalid input", success: false});

        if(!client.isOpen) return res.status(500).json({message: "Internal Server Error", success: false});

        const secret = await client.get(email, async (err, reply) => {
            if(err){
                console.log("error in getting redis key", err);
                return false;
            }
            return reply;
        });

        if(!secret) return res.status(400).json({message: "OTP expired", success: false});

        const otp = genAndSendOTP(email);
        return res.status(200).json({message: "OTP sent successfully", success: true});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
}

const sendOTP = async (req, res) => {
    const { type } = req.body;
    if (type === "change") {
        if (!req.cookies.accessToken)
            return res
                .status(401)
                .json({ message: "Error in Authentication", success: false });
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;

        const otp = genAndSendOTP(req.user.email);
        return res
            .status(200)
            .json({ message: "OTP sent successfully", success: true });
    }

    const { email } = req.body;
    const user = await Account.findOne({ email });

    if (type === "register") {
        if (user)
            return res
                .status(400)
                .json({ message: "User already exists", success: false });

        const otp = genAndSendOTP(email);
        return res
            .status(200)
            .json({ message: "OTP sent successfully", success: true });
    }

    if (type === "forgot") {
        if (!user)
            return res
                .status(400)
                .json({ message: "User does not exist", success: false });
        const otp = genAndSendOTP(email);
        return res
            .status(200)
            .json({ message: "OTP sent successfully", success: true });
    }

    return res.status(400).json({ message: "Invalid type", success: false });
};

module.exports = {sendOTP, resendOTP};
