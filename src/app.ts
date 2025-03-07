import express, { Application } from "express";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);

export default app;