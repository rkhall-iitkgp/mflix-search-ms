const bcrypt = require("bcrypt");
const { Account } = require("../../models");
const { client } = require("../../redis");

const verifyOTP = async (req, res) => {

    const {type} = req.body;

    if(type==="change"){
        if(!req.headers.authorization) return res.status(401).json({ message: "Error in Authentication", success: false});
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;
    }

    const {email, otp, newPassword} = req.body;
    if(!otp || !email || !newPassword) return res.status(400).json({ message: "Invalid input", success: false});

    const user = await Account.findOne({ email })

    if(type==="register"){
        if(user) return res.status(400).json({ message: "User already exists", success: false});
    }

    if(type==="forgot"){
        if(!user) return res.status(400).json({ message: "User does not exist", success: false});
    }

    if(!client.isOpen) return res.status(500).json({ message: "Internal Server Error", success: false});
    
    const secret = await client.get(email, async (err, reply) => {
        if (err) {
            console.log("error in getting redis key", err);
            return false;
        }
        return reply;
    })

    if(!secret) return res.status(400).json({ message: "OTP expired", success: false});
    if(secret !== otp) return res.status(400).json({ message: "Invalid OTP", success: false});

    if(type==="register"){
        const { name, phone, dob } = req.body;
        const hash = await bcrypt.hash(newPassword, 10);
        const user = new Account({ name, email, password: hash, phone, dob });
        await user.save();
    }

    if(type==="forgot" || type==="change"){
        const hash = await bcrypt.hash(newPassword, 10);
        await Account.findOneAndUpdate({ email }, { password: hash });
    }

    return res.status(200).json({ message: "OTP verified successfully", success: true });
    
};
module.exports = verifyOTP;
