import express from 'express';
import { config } from 'dotenv';
import { connectDB } from './db/index.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import movieRoutes from './routes/movie.routes.js';
import genreRoutes from './routes/genre.routes.js';
import reviewRoutes from './routes/review.routes.js';
import likeRoutes from './routes/like.routes.js';
import errorHandler from './middleware/errorHandler.js';

config();

const app = express();
const PORT = +process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  await connectDB();

  app.use('/admin', adminRoutes);
  app.use('/auth', authRoutes);
  app.use('/movies', movieRoutes);
  app.use('/genres', genreRoutes);
  app.use('/reviews', reviewRoutes);
  app.use('/likes', likeRoutes);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
