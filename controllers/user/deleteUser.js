const { Account, User } = require("../../models");
module.exports = async (req, res) => {
  const { user, userName } = req.body;
  try {
    // Assuming `email` is a property of `user` object
    const { email } = user;

    // Find the account with the provided email and populate the userProfiles field
    const existingAccount = await Account.findOne({ email })
      .select("+userProfiles")
      .exec();

    // Check if the account exists
    if (!existingAccount) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    // Extract user profiles from the existing account
    const userProfiles = existingAccount.userProfiles;

    // Check if any user profile with the given name exists
    const userProfileExists = userProfiles.some(
      (profile) => profile.name === userName,
    );

    const userProfileId = userProfileExists._id;
    // If user profile exists, delete it
    await User.findByIdAndDelete(userProfileId);

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
