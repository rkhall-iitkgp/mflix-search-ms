const { Movie, User } = require("../../models");

async function InitialFilter(req, res) {
    try {
        const userId = req.body;

        // Retrieve the user with their saved filters
        const user = await User.findById(userId).populate("savedFilters");

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }
        const requestedFilterName = req.body.filterName; // Assuming filterName is passed in the request params

        // Find all saved filters that match the requested filter name
        const matchingFilter = user.savedFilters.filter(filter => filter.name === requestedFilterName);
        const query = {}
        matchingFilter = req.body;
        //console.log(matchingFilter)
        if (matchingFilter.filters.genres) {
            console.log(matchingFilter.filters.genres);
            query.genres = { $in: [matchingFilter.filters.genres] }; // Filter by genres
        }
        if (matchingFilter.filters.languages) {
            query.languages = { $in: [matchingFilter.filters.languages] }; // Filter by genres
        }
        if (matchingFilter.filters.country) {
            query.countries = { $in: [matchingFilter.filters.country] }; // Filter by genres
        }
        if (matchingFilter.filters.year) {
            query.year = { $in: matchingFilter.filters.year }; // Filter by genres
        }
        if (matchingFilter.filters.type) {
            query.type = { $in: matchingFilter.filters.type }; // Filter by genres
        }
        if (matchingFilter.filters.rating) {
            query["imdb.rating"] = {
                $gte: matchingFilter.filters.rating.low, // Greater than or equal to the low value
                $lte: matchingFilter.filters.rating.high // Less than or equal to the high value
            };
        }
        console.log(query)
        const movies = await Movie.find(query);

        // Return the extracted filters (for testing purposes)
        res.status(200).json({
            status: true,
            movies,
        });

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
}

async function CreateFilter(req, res) {
    try {
        const { userId } = req.body;
        const { name, filters } = req.query;
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
            filters: filters
        };

        // Push the new filter object to the savedFilters array
        user.savedFilters.push(newFilter);

        // Save the updated user object
        await user.save();

        res.status(200).json({
            status: true,
            message: "New filter added successfully",
            user: user // Optionally, you can send back the updated user object
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
        const { userId } = req.body;
        const { name } = req.query;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        // Filter out the filter with the specified name
        user.savedFilters = user.savedFilters.filter(filter => filter.name !== name);

        // Save the updated user object
        await user.save();

        res.status(200).json({
            status: true,
            message: "Filter deleted successfully",
            user: user // Optionally, you can send back the updated user object
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
        const { userId } = req.body;
        const { name } = req.query;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Filter deleted successfully",
            user: user.savedFilters // Optionally, you can send back the updated user object
        });
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: false,
            message: "Error: " + error.message,
        });
    }
}

module.exports = { InitialFilter, CreateFilter, DeleteFilter, GetFilter };
