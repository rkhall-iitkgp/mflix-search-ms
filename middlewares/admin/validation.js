const Joi = require('joi');

const movieSchema = Joi.object({
  plot: Joi.string().required(),
  videoSrc: Joi.string().required(),
  genre: Joi.array().items(Joi.string()).required(),
  runtime: Joi.number().required(),
  rated: Joi.string().required(),
  cast: Joi.array().items(Joi.string()).required(),
  title: Joi.string().required(),
  fullPlot: Joi.string().required(),
  languages: Joi.array().items(Joi.string()).required(),
  released: Joi.date().required(),
  directors: Joi.array().items(Joi.string()).required(),
  writers: Joi.array().items(Joi.string()).required(),
  awards: Joi.object({
    wins: Joi.number().required(),
    nominations: Joi.number().required(),
    text: Joi.string().required()
  }),
  lastUpdated: Joi.date().required(),
  year: Joi.number().required(),
  imdb: Joi.object({
    rating: Joi.number().required(),
    votes: Joi.number().required(),
    id: Joi.number().required()
  }),
  countries: Joi.array().items(Joi.string()).required(),
  type: Joi.string().required(),
  num_mflix_comments: Joi.number().required(),
  tomatoes: Joi.object({
    viewer: Joi.object({
      rating: Joi.number().required(),
      numReviews: Joi.number().required(),
      meter: Joi.number().required()
    }),
    dvd: Joi.date().required(),
    lastupdated: Joi.date().required()
  })
});

const validateMovie = (req, res, next) => {
    const { error, value } = movieSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }
    req.validatedBody = value;
    next();
  };
  
module.exports = { validateMovie };