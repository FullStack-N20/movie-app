import Genre from '../models/genre.js';

export class GenreController {
  async list(req, res, next) {
    try {
      const genres = await Genre.find();
      res.json(genres);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { name } = req.body;
      const existing = await Genre.findOne({ name });
      if (existing)
        return res.status(400).json({ message: 'Genre already exists' });
      const genre = await Genre.create({ name });
      res.status(201).json(genre);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const genre = await Genre.findOne({ id: req.params.id });
      if (!genre) return res.status(404).json({ message: 'Genre not found' });
      await genre.deleteOne();
      res.json({ message: 'Genre deleted' });
    } catch (err) {
      next(err);
    }
  }
}
