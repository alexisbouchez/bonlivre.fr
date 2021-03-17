import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import userRouter from './routers/user-router';
import bookRouter from './routers/book-router';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/books', bookRouter);

export default app;
