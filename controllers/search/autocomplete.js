const { Movie } = require("../../models");

async function AutoComplete(req, res) {
	try {
		// define pipeline
		const { query } = req.query;

		const agg = [
			{
				$search: {
					index: "autocomplete",
					compound: {
						should: [
							{
								autocomplete: {
									query: query,
									path: "title",
								},
							},
							{
								autocomplete: {
									query: query,
									path: "plot",
								},
							},
						],
						minimumShouldMatch: 1,
					},
				},
			},
			{
				$limit: 5,
			},
			{
				$project: {
					_id: 0,
					title: 1,
					plot: 1,
				},
			},
		];
		// run pipelines
		const result = await Movie.aggregate(agg);

		// print results
		res.json(result);
	} catch {
		console.log("Error: ", error);
		res.json({
			message: "Error: " + error.message,
		});
	}
}

module.exports = AutoComplete;
