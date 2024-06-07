import express from "express";
import http from "http";
import path from "path";
import crypto from "crypto";
import session from "express-session";
import fileUpload from "express-fileupload";
import cors from "cors";

// import { socket_io } from "./socket_io/socket_io_class";

// Роутеры
import { router as mechanism_router } from "./routers/mechanism";
import { router as song_mechanism_router } from "./routers/song_mechanism";
import create_search_cache from "./mechanism_exports/create_search_cache";

const host: string = "0.0.0.0";
const port: number = 1337;
const app = express();
const server = http.createServer(app);

declare module 'express-session' {
    export interface SessionData {
        authorization: { login: string, password: string };
        authorization_data: { login: string, password: string };
    }
}

app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public"))); // Папка, куда сервер смотрит от безысходности.
app.use(cors({ 
    origin: "http://localhost:5173", 
    methods: ["POST", "PUT", "GET", "DELETE"], 
    credentials: true, 
})); // Корс
app.use(express.json()); // Инициализирует request.body;

const sessionMiddleware = session({
    secret: crypto.randomBytes(32).toString("hex"),
    resave: true,
    saveUninitialized: true,
});
app.use(sessionMiddleware);

app.use((request, response, next) => {
    console.log("Someone send a request (●'^'●)");
    next();
});

app.use("/mechanism", mechanism_router);
app.use("/song_mechanism", song_mechanism_router);

app.use((request, response, next) => {
    response.status(404).send("404");
});

// socket_io.initSocketIO(server);
// socket_io.getSocketIO()?.engine.use(sessionMiddleware); // Даёт мне возможность использовать сеансы в сокетах.
// socket_io.checkEventsSocketIO();

server.listen({
    host: host,
    port: port,
}, () => {
    console.log("Server launched on " + host + ":" + port);
});