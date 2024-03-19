const { Movie } = require("../../models");

async function FuzzySearch(req, res) {
  try {
    // define pipeline
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.status(400).json({
        status: false,
        message: "Error: " + "Query length is too small",
      })
    }

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
              maxExpansions: 10,
            },
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 0,
          title: 1,
          plot: 1,
          score: { $meta: "searchScore" },
        },
      },
    ];
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
    res.status(200).json({
      status: true,
      result
    });
  } catch {
    console.log("Error: ", error);
    res.status.json({
      status: false,
      message: "Error: " + error.message,
    });
  }
}

module.exports = FuzzySearch;
