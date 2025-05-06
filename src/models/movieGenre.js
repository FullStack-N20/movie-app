import mongoose from 'mongoose';

const movieGenreSchema = new mongoose.Schema({
  movie_id: { type: String, ref: 'Movie', required: true },
  genre_id: { type: String, ref: 'Genre', required: true },
});

export default mongoose.model('MovieGenre', movieGenreSchema);
