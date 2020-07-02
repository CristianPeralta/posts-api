import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';

const app: Application = express();

const allowedOrigins: Array<String> = [
    'http://localhost:3000',
];

const options: CorsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin) return callback(null, true);
    if (allowedOrigins.indexOf(requestOrigin) === -1) {
      const msg: string = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

app.use(cors(options));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.listen(5000, () => console.log('Server running, port: 5000'));