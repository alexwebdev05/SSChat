import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import router from './routes/user.routes';

import env from './conf/env';

const app = express();
const PORT = env.PORT;

// Enable http requests from the client
app.use(cors());

// Change receibed data to json
app.use(bodyParser.json());

// Routes
app.use('/api', router);


// Starts the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
