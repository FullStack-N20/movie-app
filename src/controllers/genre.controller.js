import Genre from '../models/genre.js';

export class GenreController {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, sort = 'name' } = req.query;
      const skip = (page - 1) * limit;

      const genres = await Genre.find()
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Genre.countDocuments();

      return res.status(200).json({
        status: 'success',
        message: 'Genres retrieved successfully',
        data: {
          genres,
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
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          status: 'error',
          message: 'Genre name is required',
          statusCode: 400,
        });
      }

      const existing = await Genre.findOne({ name });
      if (existing) {
        return res.status(409).json({
          status: 'error',
          message: 'Genre already exists',
          statusCode: 409,
        });
      }

      const genre = await Genre.create({ name });

      return res.status(201).json({
        status: 'success',
        message: 'Genre created successfully',
        data: genre,
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
      const genre = await Genre.findOne({ id });

      if (!genre) {
        return res.status(404).json({
          status: 'error',
          message: 'Genre not found',
          statusCode: 404,
        });
      }

      await genre.deleteOne();

      return res.status(200).json({
        status: 'success',
        message: 'Genre deleted successfully',
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
