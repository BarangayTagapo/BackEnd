import 'express-async-errors';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import xss from 'xss-clean';

// middleware
import notFound from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';
import authenticate from './middleware/authenticate.js';

// importing routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import announcementRoutes from './routes/announcement.js';
import applicationRoutes from './routes/application.js';

dotenv.config();
const app = express();
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());
app.set('trust proxy', 1);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(xss());

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ success: true, message: 'Welcome to barangay Tagapo website' });
});

// Routes
app.use('/authenticate', authRoutes);
app.use('/user', authenticate, userRoutes);
app.use('/announcements', announcementRoutes);
app.use('/applications', authenticate, applicationRoutes);
app.use('/images', express.static('images'));

// error middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

// Connecting to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, console.log(`Server is  running on port ${PORT}`))
  )
  .catch((err) => console.log(err));
