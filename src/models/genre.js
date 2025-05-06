import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const genreSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true, unique: true },
});

export default mongoose.model('Genre', genreSchema);
