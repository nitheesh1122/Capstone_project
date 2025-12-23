import app from './app';
import { checkConnection } from './config/db';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await checkConnection();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
