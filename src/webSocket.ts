import WebSocket, { WebSocketServer } from "ws";
import queryString from "query-string";
import { Log } from '@utils/logger';

interface WebSocketConnection extends WebSocket {
    isAlive?: boolean;
    type?: string | (string | null)[] | null;
}

function heartbeat() {
    // @ts-expect-error
    this.isAlive = true;
}

class Socket {
    webSocketServer: WebSocketServer;
    interval: NodeJS.Timer;
    constructor() {
        this.webSocketServer = new WebSocket.Server({
            noServer: true,
            path: "/",
        });
        Log.info("Websocket connected")
        this.interval = setInterval(() => {
            this.webSocketServer.clients.forEach((ws: WebSocketConnection) => {
                if (ws.isAlive === false) return ws.terminate();

                ws.isAlive = false;
                const now = Date.now()
                ws.send(`test: ${now}`)
                ws.ping();
            });
        }, 1000);;
    }

    initialize(expressServer) {
        expressServer.on("upgrade", (request, socket, head) => {
            this.webSocketServer.handleUpgrade(request, socket, head, (websocket) => {
                this.webSocketServer.emit("connection", websocket, request);
            });
        });

        this.webSocketServer.on(
            "connection",
            (websocketConnection: WebSocketConnection, connectionRequest) => {
                Log.info("Client connected to webSocket")
                // @ts-expect-error
                const [_path, params] = connectionRequest?.url?.split("?");
                const connectionParams = queryString.parse(params);
                websocketConnection.isAlive = true;

                // NOTE: connectParams are not used here but good to understand how to get
                // to them if you need to pass data with the connection to identify it (e.g., a userId).
                console.log(connectionParams);
                websocketConnection.type = connectionParams?.type;

                websocketConnection.on('pong', heartbeat)

                websocketConnection.on("message", (message) => {
                    const parsedMessage = JSON.parse(message.toString());
                    console.log(parsedMessage)
                    websocketConnection.send(JSON.stringify({ message: `There be gold in them thar hills. message: ${parsedMessage.toString()}` }));
                });
            }
        );
        this.webSocketServer.on('close', () => {
            clearInterval(this.interval);
        });

        return this.webSocketServer;
    }

    getWebSocketConnections() {
        return this.webSocketServer.clients;
    }
}

const SocketServer = new Socket();

export { SocketServer, WebSocketConnection }