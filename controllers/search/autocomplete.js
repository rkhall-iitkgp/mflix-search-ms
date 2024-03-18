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
									fuzzy: {
										maxEdits: 1,
										prefixLength: 4,
									},
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
					_id: 1,
					title: 1,
					tomatoes: {
						viewer: {
							meter: 1,
						},
					},
				},
			},
		];
		// run pipelines
		const result = await Movie.aggregate(agg);

		// console.log("result", result);
		// print results
		res.json({ result });
	} catch (error) {
		console.log("Error: ", error);
		res.json({
			message: "Error: " + error.message,
		});
	}
}

module.exports = AutoComplete;
