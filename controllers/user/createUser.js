const { Account, User } = require("../../models");
module.exports = async (req, res) => {
    const { userName } = req.body;
    const user = req.user;
    try {
        // Assuming `email` is a property of `user` object
        const accountId = user.id;
        // Find the account with the provided email and populate the userProfiles field
        const existingAccount = await Account.findById(accountId)
            .select("+userProfiles")
            .exec();
        // Check if the account exists
        if (!existingAccount) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        // // Extract user profiles from the existing account
        const userProfileIds = existingAccount.userProfiles; // Assuming userProfiles contains only IDs
        const userProfiles = await User.find({
            _id: { $in: userProfileIds },
        });

        console.log("userProfiles", userProfiles);

        // Check if any user profile with the given name exists
        const userProfileExists = userProfiles.some(
            (profile) => profile.name === userName,
        );
        console.log("userProfileExists", userProfileExists);
        if (userProfileExists) {
            return res.status(400).json({
                success: false,
                message: "User profile with the given name already exists",
            });
        }

        // // If the user profile doesn't exist, create a new one
        const newProfile = new User({ name: userName });
        await newProfile.save();

        // // // Add the newly created profile to the userProfiles array in the account
        existingAccount.userProfiles.push(newProfile);
        await existingAccount.save();

        const newAccount = await Account.findById(accountId).populate({
            path: "userProfiles",
            model: "users",
        }).exec();

        // Return success response
        return res.status(200).json({
            success: true,
            message: "New user profile created successfully",
            account: newAccount,
        });
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message,
        });
    }
};
