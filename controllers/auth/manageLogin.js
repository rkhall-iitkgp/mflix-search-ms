const { ActiveLogin, Account } = require("../../models");

const removeActiveLogin = async (req, res) => {
    try {
        const { loginId } = req.body;
        const activeLogin = await ActiveLogin.findById(loginId).exec();

        if (!activeLogin) {
            return res.status(401).json({
                success: false,
                message: "Active login session not found",
            });
        }

        await ActiveLogin.deleteOne({
            sessionId: activeLogin.sessionId,
            account: req.user.id,
        }).exec();

        const account = await Account.findOne({ email: req.user.email }).exec();
        account.activeLogins = account.activeLogins.filter(
            (login) => login.toString() !== loginId.toString(),
        );
        await account.save();

        return res.status(200).json({
            success: true,
            message: "Active login session removed successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during logout",
        });
    }
};

const getActiveLogins = async (req, res) => {
    try {
        console.log(req.user);
        const account = await Account.findOne({ email: req.user.email }).exec();
        if (!account) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Active logins fetched successfully",
            activeLogins: account.activeLogins,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during fetching active logins",
        });
    }
};

module.exports = { removeActiveLogin, getActiveLogins };
