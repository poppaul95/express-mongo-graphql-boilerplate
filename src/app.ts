import http from 'http'
import express from 'express';
import ejs from 'ejs';
import mongoose from 'mongoose';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { resolvers } from '@resolvers/index';
import { schema } from '@schemas/index';
import { Log } from '@/utils/logger';
import { SocketServer } from '@/webSocket'
import validateTokens from '@middlewares/authorisation'
import { appConfig } from '@/config';

const startApolloServer = async () => {
    const app = express();
    app.use(validateTokens);
    app.engine('html', ejs.renderFile);
    app.set('view engine', 'html');
    app.set('views', __dirname);

    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs: schema,
        resolvers,
        context: ({ req, res }) => ({ req, res }),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    server.applyMiddleware({ app, path: '/graphQL' });
    server.applyMiddleware({
        app, cors: {
            origin: '*',
            credentials: false,
        }
    });
    const websocketServer = SocketServer.initialize(httpServer);

    await new Promise<void>(resolve => httpServer.listen({ port: appConfig.port }, resolve));

    Log.info(`🚀 Server ready at http://localhost:${appConfig.port}${server.graphqlPath}`);
    app.use('/status', (req, res) => {
        // @ts-expect-error 
        const graphQl = server.state.phase === 'started' ? 'green' : 'red'
        const wsStatus = websocketServer ? 'green' : 'red'
        res.render('./status.html', { name: 'Digital Crusade Api Status', appStatus: 'green', graphQlStatus: graphQl, webSocketStatus: wsStatus })
    })


    return { server, app, websocketServer };
}

const connectToDatabase = async () => {
    mongoose.Promise = global.Promise;
    mongoose
        .connect(appConfig.dbUrl, {})
        .then(() => Log.info('Database Connected'))
        .catch((err) => Log.error(err, 'Error connecting to the database'));

    mongoose.connection.once('open', () =>
        Log.info(`Connecting to database`)
    );

    return { mongoose }
}

export { connectToDatabase, startApolloServer }