import Review from '../models/review.js';

export class ReviewController {
  async list(req, res, next) {
    try {
      const { movie_id } = req.query;
      const filter = movie_id ? { movie_id } : {};
      const reviews = await Review.find(filter);
      res.json(reviews);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { movie_id, content, rating } = req.body;
      const review = await Review.create({
        user_id: req.user.userId,
        movie_id,
        content,
        rating,
      });
      res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const review = await Review.findOne({ id: req.params.id });
      if (!review) return res.status(404).json({ message: 'Review not found' });
      if (review.user_id !== req.user.userId)
        return res.status(403).json({ message: 'Forbidden' });
      const { content, rating } = req.body;
      if (content) review.content = content;
      if (rating !== undefined) review.rating = rating;
      await review.save();
      res.json(review);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const review = await Review.findOne({ id: req.params.id });
      if (!review) return res.status(404).json({ message: 'Review not found' });
      if (review.user_id !== req.user.userId)
        return res.status(403).json({ message: 'Forbidden' });
      await review.deleteOne();
      res.json({ message: 'Review deleted' });
    } catch (err) {
      next(err);
    }
  }
}
