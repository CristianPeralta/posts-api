import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();

const getGreeting = (name: string): string => `Hello ${name}`;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send(getGreeting('World!!'));
});

app.listen(3000, () => console.log('Server running, port: 3000'));