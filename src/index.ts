


import { connectToDatabase, startApolloServer } from './app'
import { Log } from './utils/logger';
import validateEnv from '@utils/validateEnv';

validateEnv();

const addProccessHandlers = (mongoose) => {
    process.on('SIGINT', () => {
        Log.info('Received SIGINT event');
        mongoose.disconnect().finally(() => {
            Log.info("Disconected from database")
            process.exit(0)
        })
    });
    process.on('SIGTERM', () => {
        Log.info('Received SIGTERM event');
        mongoose.disconnect().finally(() => {
            Log.info("Disconected from database")
            process.exit(0)
        })
    });
}

(async (): Promise<void> => {
    await startApolloServer();
    const { mongoose } = await connectToDatabase()
    addProccessHandlers(mongoose);
})();