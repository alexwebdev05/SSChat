
import { dbConnect } from './conf/db';

const startApp = async () => {
    await dbConnect();
    // Aquí puedes iniciar tu servidor, realizar consultas, etc.
};

startApp().catch(err => {
    console.error('Error al iniciar la aplicación:', err);
});