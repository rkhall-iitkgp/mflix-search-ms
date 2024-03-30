const {Account, User, ActiveLogin} = require("../../models");

const getUserDetails = async (req, res) => {

    try {
        const {email} = req.user
        console.log("Email: ", email)
        const account = await Account.findOne({email}).select("-password").populate({
            path: "subscriptionTier",
            populate: { path: "tier", model: "tiers" },
        }).populate({
            path: "userProfiles",
            model: "users",
        }).populate({
            path: "activeLogins",
            model: "activeLogin",
            select: "loginTime userAgent ipAddress"
        }).exec()
        
        if (!account) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            account: account
        })
    } catch (error) {
        console.error("Error: ", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message
        })
    }
}


const updateUserDetails = async (req, res) => {

    try{

        const {name, phone} = req.body;
        const {email} = req.user;

        const user = await Account.findOne({email}).exec();
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if(name) user.name = name;
        if(phone) user.phone = phone;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User details updated successfully",
            account: user
        })
    }
    catch(error){
        console.error("Error: ", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message
        })
    }       
}

module.exports = {getUserDetails, updateUserDetails}