import Review from '../models/review.js';

export class ReviewController {
  async list(req, res) {
    try {
      const { movie_id, page = 1, limit = 10, sort = '-createdAt' } = req.query;
      const skip = (page - 1) * limit;
      const filter = movie_id ? { movie_id } : {};

      const reviews = await Review.find(filter)
        .populate('user_id', 'name email')
        .populate('movie_id', 'title')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Review.countDocuments(filter);

      return res.status(200).json({
        status: 'success',
        message: 'Reviews retrieved successfully',
        data: {
          reviews,
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async create(req, res) {
    try {
      const { movie_id, content, rating } = req.body;

      if (!movie_id || !content || rating === undefined) {
        return res.status(400).json({
          status: 'error',
          message: 'Movie ID, content and rating are required',
          statusCode: 400,
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          status: 'error',
          message: 'Rating must be between 1 and 5',
          statusCode: 400,
        });
      }

      const review = await Review.create({
        user_id: req.user.userId,
        movie_id,
        content,
        rating,
      });

      const populatedReview = await Review.findById(review._id)
        .populate('user_id', 'name email')
        .populate('movie_id', 'title');

      return res.status(201).json({
        status: 'success',
        message: 'Review created successfully',
        data: populatedReview,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { content, rating } = req.body;

      const review = await Review.findOne({ id });
      if (!review) {
        return res.status(404).json({
          status: 'error',
          message: 'Review not found',
          statusCode: 404,
        });
      }

      if (review.user_id.toString() !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to update this review',
          statusCode: 403,
        });
      }

      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return res.status(400).json({
          status: 'error',
          message: 'Rating must be between 1 and 5',
          statusCode: 400,
        });
      }

      const updatedReview = await Review.findByIdAndUpdate(
        review._id,
        {
          ...(content && { content }),
          ...(rating !== undefined && { rating }),
        },
        { new: true }
      )
        .populate('user_id', 'name email')
        .populate('movie_id', 'title');

      return res.status(200).json({
        status: 'success',
        message: 'Review updated successfully',
        data: updatedReview,
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findOne({ id });

      if (!review) {
        return res.status(404).json({
          status: 'error',
          message: 'Review not found',
          statusCode: 404,
        });
      }

      if (review.user_id.toString() !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to delete this review',
          statusCode: 403,
        });
      }

      await review.deleteOne();

      return res.status(200).json({
        status: 'success',
        message: 'Review deleted successfully',
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
