const { Movie, User } = require("../../models");

async function CreateFilter(req, res) {
    try {
        const {userId} = req.params;
        const {name, filters } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        // Create a new filter object
        const newFilter = {
            name: name,
            filters: filters,
        };

        // Push the new filter object to the savedFilters array
        user.savedFilters.push(newFilter);

        // Save the updated user object
        await user.save();

        res.status(200).json({
            status: true,
            message: "New filter added successfully",
            user: user, // Optionally, you can send back the updated user object
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
}

async function DeleteFilter(req, res) {
    try {
        const { userId } = req.params;
        const { name } = req.query;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        // Filter out the filter with the specified name
        user.savedFilters = user.savedFilters.filter(
            (filter) => filter.name !== name,
        );

        // Save the updated user object
        await user.save();

        res.status(200).json({
            status: true,
            message: "Filter deleted successfully",
            user: user, // Optionally, you can send back the updated user object
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
}

async function GetFilter(req, res) {
    try {
        const { userId } = req.params;
        const { name } = req.query;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }
        const filter = user.savedFilters.find((filter) => filter.name === name);

        if (!filter) {
            return res.status(404).json({
                status: false,
                message: "Filter not found",
            });
        }

        // Optionally, you can send back the specific filter instead of the entire user object
        res.status(200).json({
            status: true,
            message: "Filter retrieved",
            filter: filter,
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
}

module.exports = { CreateFilter, DeleteFilter, GetFilter };
