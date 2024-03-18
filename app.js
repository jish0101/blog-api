import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import config from './Utils/config.js';
import { corsOptions } from './Config/corsConfig.js';
import { connectToDatabase } from './Config/dbConfig.js';
import { credentials } from './Middlerwares/credentials.js';
import { errorHandler, notFoundHandler } from './Middlerwares/errorHandler.js';

import userRouter from './Routers/Users/UsersRouter.js';
import postRouter from './Routers/Post/PostRouter.js';
import { verifyAuth } from './Middlerwares/verifyAuth.js';

connectToDatabase();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(morgan('common'));

// app.use(verifyAuth);
app.use('/post', postRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'This is the home route of the api!',
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

mongoose.connection.once('open', () => {
  server.listen(config.PORT, () =>
    console.log(`Listening on port => ${config.PORT}`),
  );
});
