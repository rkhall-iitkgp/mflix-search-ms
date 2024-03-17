const { Movie } = require("../../models");

async function FuzzySearch(req, res) {
	try {
		// define pipeline
		const { query } = req.query;

		const agg = [
            {
              $search: {
                index: "autocomplete",
                autocomplete: {
                  path: "title",
                  query: query,
                  fuzzy: {
                    maxEdits: 2,
                    prefixLength: 0,
                    maxExpansions: 10
                  }
                }
              }
            },
            {
                $limit: 10
            },
            {
                $project: {
                  "_id": 0,
                  "title": 1,
                  "plot":1,
                  score: { $meta: "searchScore" }
                }
              }
          ]
    // const agg = [
    //   {
    //     $search: {
    //       text: {
    //         path: "title",
    //         query: query,
    //       }
    //     }
    //   },
    //   {
    //     $project: {
    //       "_id": 0,
    //       "title": 1,
    //       score: { $meta: "searchScore" }
    //     }
    //   }
    // ]
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

module.exports = FuzzySearch;
