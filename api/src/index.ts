import express, { Application, Request, Response } from 'express';
import { json } from 'body-parser';
import userRoutes from './routes/user.routes'; // Asegúrate de que la ruta sea correcta
import { dbConnect } from './conf/db'; // Importa tu función de conexión a la base de datos (si es necesaria)
import env from './conf/env';

const app: Application = express();
const PORT = env.PORT || 3000;

// Middleware
app.use(json()); // Para analizar el cuerpo de las solicitudes en formato JSON

// Conectar a la base de datos (opcional, si es necesario)
dbConnect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

// Rutas
app.use('/api/users', userRoutes); // Usa tus rutas de usuario

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Manejo de errores
app.use((err: any, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
