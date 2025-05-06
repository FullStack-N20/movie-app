import Like from '../models/like.js';

export class LikeController {
  async like(req, res, next) {
    try {
      const { review_id } = req.body;
      const existing = await Like.findOne({
        review_id,
        user_id: req.user.userId,
      });
      if (existing) return res.status(400).json({ message: 'Already liked' });
      const like = await Like.create({ review_id, user_id: req.user.userId });
      res.status(201).json(like);
    } catch (err) {
      next(err);
    }
  }

  async unlike(req, res, next) {
    try {
      const { review_id } = req.body;
      const like = await Like.findOne({ review_id, user_id: req.user.userId });
      if (!like) return res.status(404).json({ message: 'Like not found' });
      await like.deleteOne();
      res.json({ message: 'Unliked' });
    } catch (err) {
      next(err);
    }
  }
}
