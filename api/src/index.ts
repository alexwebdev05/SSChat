import express from 'express';
import bodyParser from 'body-parser';

import router from './routes/user.routes';

import env from './conf/env';

const app = express();
const PORT = env.PORT;

app.use(bodyParser.json());

// Rutas
app.use('/api/users', router);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
