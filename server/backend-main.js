"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const express_session_1 = __importDefault(require("express-session"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
// import { socket_io } from "./socket_io/socket_io_class";
// Роутеры
const mechanism_1 = require("./routers/mechanism");
const song_mechanism_1 = require("./routers/song_mechanism");
const host = "0.0.0.0";
const port = 1337;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public"))); // Папка, куда сервер смотрит от безысходности.
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
})); // Корс
app.use(express_1.default.json()); // Инициализирует request.body;
const sessionMiddleware = (0, express_session_1.default)({
    secret: crypto_1.default.randomBytes(32).toString("hex"),
    resave: true,
    saveUninitialized: true,
});
app.use(sessionMiddleware);
app.use((request, response, next) => {
    console.log("Someone send a request (●'^'●)");
    next();
});
app.use("/mechanism", mechanism_1.router);
app.use("/song_mechanism", song_mechanism_1.router);
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
