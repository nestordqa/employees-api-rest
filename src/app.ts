import express, { Application } from "express";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import employeesRoutes from './routes/employeesRoutes';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Opciones de configuración para Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Versión de OpenAPI
        info: {
            title: 'Wecaria API Rest', // Título de tu API
            version: '1.0.0', // Versión de tu API
            description: 'Wecaria API Rest Technical test', // Descripción
        },
    },
    apis: ['./src/routes/*.ts'], // Ruta donde se encuentran los archivos con comentarios Swagger
};

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeesRoutes);



// Generar la especificación Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
// Route for docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export default app;