const bcrypt = require("bcrypt");
const { Account, User } = require("../../models");
const { client } = require("../../redis");
const jwt = require("jsonwebtoken");

const verifyOTP = async (req, res) => {
    const { type } = req.body;

    if (type === "change") {
        if (!req.cookies.accessToken)
            return res
                .status(401)
                .json({ message: "Error in Authentication", success: false });
        const token = req.cookies.accessToken;
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded;
    }

    const { email, otp, newPassword } = req.body;
    if (!otp || !email || !newPassword)
        return res
            .status(400)
            .json({ message: "Invalid input", success: false });

    const user = await Account.findOne({ email });

    if (type === "register") {
        if (user)
            return res
                .status(400)
                .json({ message: "User already exists", success: false });
    }

    if (type === "forgot") {
        if (!user)
            return res
                .status(400)
                .json({ message: "User does not exist", success: false });
    }

    if (!client.isOpen)
        return res
            .status(500)
            .json({ message: "Internal Server Error", success: false });

    const secret = await client.get(email, async (err, reply) => {
        if (err) {
            console.log("error in getting redis key", err);
            return false;
        }
        return reply;
    });

    if (!secret)
        return res.status(400).json({ message: "OTP expired", success: false });
    if (secret !== otp)
        return res.status(400).json({ message: "Invalid OTP", success: false });

    if (type === "register") {
        const { name, phone, dob } = req.body;
        const hash = await bcrypt.hash(newPassword, 10);
        const user = new Account({ name, email, password: hash, phone, dob });

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.ACCESS_SECRET, {
            expiresIn: process.env.ACCESS_EXPIRE_TIME,
        });

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true, 
            sameSite: "none",
        });

        const userProfile = new User({ name: user.name });
        await userProfile.save();

        user.userProfiles.push(userProfile._id);
        await user.save();

        user.password = undefined;

        const newUser = await Account.findOne({ email }).populate({
            path: "subscriptionTier",
            populate: { path: "tier", model: "tiers" },
        }).populate({
            path: "userProfiles",
            model: "users",
        }).exec();

        return res
            .status(200)
            .json({
                message: "User registered successfully",
                success: true,
                account: user,
            });
    }

    if (type === "forgot" || type === "change") {
        const hash = await bcrypt.hash(newPassword, 10);
        await Account.findOneAndUpdate({ email }, { password: hash });
    }

    return res
        .status(200)
        .json({ message: "OTP verified successfully", success: true });
};
module.exports = verifyOTP;
