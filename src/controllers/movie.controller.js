import Movie from '../models/movie.js';

export class MovieController {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
      const skip = (page - 1) * limit;

      const movies = await Movie.find()
        .populate('created_by', 'name email')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Movie.countDocuments();

      return res.status(200).json({
        status: 'success',
        message: 'Movies retrieved successfully',
        data: {
          movies,
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

  async detail(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findOne({ id })
        .populate('created_by', 'name email')
        .populate('reviews')
        .populate('likes');

      if (!movie) {
        return res.status(404).json({
          status: 'error',
          message: 'Movie not found',
          statusCode: 404,
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Movie retrieved successfully',
        data: movie,
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
      const { title, description, release_year } = req.body;

      if (!title || !description || !release_year) {
        return res.status(400).json({
          status: 'error',
          message: 'Title, description and release year are required',
          statusCode: 400,
        });
      }

      const movie = await Movie.create({
        title,
        description,
        release_year,
        created_by: req.user.userId,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Movie created successfully',
        data: movie,
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
      const { title, description, release_year } = req.body;

      const movie = await Movie.findOne({ id });
      if (!movie) {
        return res.status(404).json({
          status: 'error',
          message: 'Movie not found',
          statusCode: 404,
        });
      }

      if (movie.created_by.toString() !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to update this movie',
          statusCode: 403,
        });
      }

      const updatedMovie = await Movie.findByIdAndUpdate(
        movie._id,
        {
          ...(title && { title }),
          ...(description && { description }),
          ...(release_year && { release_year }),
        },
        { new: true }
      ).populate('created_by', 'name email');

      return res.status(200).json({
        status: 'success',
        message: 'Movie updated successfully',
        data: updatedMovie,
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
      const movie = await Movie.findOne({ id });

      if (!movie) {
        return res.status(404).json({
          status: 'error',
          message: 'Movie not found',
          statusCode: 404,
        });
      }

      if (movie.created_by.toString() !== req.user.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not authorized to delete this movie',
          statusCode: 403,
        });
      }

      await movie.deleteOne();

      return res.status(200).json({
        status: 'success',
        message: 'Movie deleted successfully',
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
