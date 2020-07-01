import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

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

const getGreeting = (name: string): string => `Hello ${name}`;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send(getGreeting('World!!'));
});

app.listen(3000, () => console.log('Server running, port: 3000'));