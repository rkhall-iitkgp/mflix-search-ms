const Joi = require('joi');

const movieSchema = Joi.object({
  plot: Joi.string(),
  videoSrc: Joi.string(),
  genres: Joi.array().items(Joi.string()),
  runtime: Joi.number(),
  rated: Joi.string(),
  cast: Joi.array().items(Joi.string()),
  title: Joi.string(),
  fullplot: Joi.string(),
  languages: Joi.array().items(Joi.string()),
  released: Joi.date(),
  directors: Joi.array().items(Joi.string()),
  writers: Joi.array().items(Joi.string()),
  awards: Joi.object({
    wins: Joi.number(),
    nominations: Joi.number(),
    text: Joi.string()
  }),
  lastupdated: Joi.date(),
  year: Joi.number(),
  imdb: Joi.object({
    rating: Joi.number(),
    votes: Joi.number(),
    id: Joi.number()
  }),
  countries: Joi.array().items(Joi.string()),
  type: Joi.string(),
  num_mflix_comments: Joi.number(),
  tomatoes: Joi.object({
    viewer: Joi.object({
      rating: Joi.number(),
      numReviews: Joi.number(),
      meter: Joi.number()
    }),
    rotten: Joi.number(),
    fresh: Joi.number(),
    dvd: Joi.date(),
    lastupdated: Joi.date()
  }),
  poster: Joi.string(),
});

const validateMovie = (req, res, next) => {
    const { error, value } = movieSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }
    req.validatedBody = value;
    next();
};

const idSchema = Joi.object({
  id: Joi.string().length(24).hex()
});

const validateId = (req, res, next) => {
  const { error } = idSchema.validate({ id: req.params.id });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
  
module.exports = { validateMovie , validateId };