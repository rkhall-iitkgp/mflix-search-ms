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
    if (userProfileExists) {
      return res.status(400).json({
        success: false,
        message: "User profile with the given name already exists",
      });
    }

    // If the user profile doesn't exist, create a new one
    const newProfile = new User({ name: userName });
    await newProfile.save();

    // Add the newly created profile to the userProfiles array in the account
    existingAccount.userProfiles.push(newProfile);
    await existingAccount.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: "New user profile created successfully",
      userProfile: newProfile,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};
