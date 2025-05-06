import Like from '../models/like.js';

export class LikeController {
  async like(req, res) {
    try {
      const { review_id } = req.body;

      if (!review_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Review ID is required',
          statusCode: 400,
        });
      }

      const existing = await Like.findOne({
        review_id,
        user_id: req.user.userId,
      });

      if (existing) {
        return res.status(409).json({
          status: 'error',
          message: 'You have already liked this review',
          statusCode: 409,
        });
      }

      const like = await Like.create({
        review_id,
        user_id: req.user.userId,
      });

      const populatedLike = await Like.findById(like._id)
        .populate('user_id', 'name email')
        .populate('review_id', 'content');

      return res.status(201).json({
        status: 'success',
        message: 'Review liked successfully',
        data: populatedLike,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async unlike(req, res) {
    try {
      const { review_id } = req.body;

      if (!review_id) {
        return res.status(400).json({
          status: 'error',
          message: 'Review ID is required',
          statusCode: 400,
        });
      }

      const like = await Like.findOne({
        review_id,
        user_id: req.user.userId,
      });

      if (!like) {
        return res.status(404).json({
          status: 'error',
          message: 'Like not found',
          statusCode: 404,
        });
      }

      await like.deleteOne();

      return res.status(200).json({
        status: 'success',
        message: 'Review unliked successfully',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}
