import Movie from '../models/movie.js';

export class MovieController {
  async list(req, res, next) {
    try {
      const movies = await Movie.find().populate('created_by', 'name email');
      res.json(movies);
    } catch (err) {
      next(err);
    }
  }

  async detail(req, res, next) {
    try {
      const movie = await Movie.findOne({ id: req.params.id }).populate(
        'created_by',
        'name email'
      );
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      res.json(movie);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { title, description, release_year } = req.body;
      const movie = await Movie.create({
        title,
        description,
        release_year,
        created_by: req.user.userId,
      });
      res.status(201).json(movie);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const movie = await Movie.findOne({ id: req.params.id });
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      if (movie.created_by !== req.user.userId)
        return res.status(403).json({ message: 'Forbidden' });
      const { title, description, release_year } = req.body;
      if (title) movie.title = title;
      if (description) movie.description = description;
      if (release_year) movie.release_year = release_year;
      await movie.save();
      res.json(movie);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const movie = await Movie.findOne({ id: req.params.id });
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      if (movie.created_by !== req.user.userId)
        return res.status(403).json({ message: 'Forbidden' });
      await movie.deleteOne();
      res.json({ message: 'Movie deleted' });
    } catch (err) {
      next(err);
    }
  }
}
