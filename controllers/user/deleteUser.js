const { Account, User } = require("../../models");

module.exports = async (req, res) => {
    const { userId } = req.body;

    try {
        // Fetch the accountId from the authenticated user
        const accountId = req.user.id;

        // Find the account with the provided accountId
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

        // Find the index of the user profile in the userProfiles array
        const userProfileIndex = existingAccount.userProfiles.findIndex(
            (profile) => profile.toString() === userId,
        );

        // If the user profile does not exist, return 404
        if (userProfileIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "User profile not found",
            });
        }

        // Remove the user profile from the userProfiles array
        existingAccount.userProfiles.splice(userProfileIndex, 1);

        // Save the changes to the Account model
        await existingAccount.save();

        // Delete the user profile from the User model
        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "User profile deleted successfully",
        });
    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error: " + error.message,
        });
    }
};
