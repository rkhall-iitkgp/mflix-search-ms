const { Account, ActiveLogin } = require("../../models");

const logout = async (req, res) => {
    const { email } = req.user;

    try {
        const user = await Account.findOne({ email }).exec();
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken);
        const activeLoginInstance = await ActiveLogin.findOne({ sessionId: refreshToken, account: user._id }).exec();
        if (!activeLoginInstance) {
            return res.status(401).json({
                success: false,
                message: "Active login session not found",
            });
        }

        await ActiveLogin.deleteOne({ sessionId: refreshToken, account: user._id });

        console.log(user.activeLogins);
        console.log(activeLoginInstance._id);

        user.activeLogins = user.activeLogins.filter((login) => login.toString() !== activeLoginInstance._id.toString());
        console.log(user.activeLogins);

        await user.save();

        res.clearCookie('refreshToken');
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during logout",
        });
    }
};

module.exports = logout;
