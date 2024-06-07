"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const check_authorization_valid_js_1 = require("../mechanism_exports/check_authorization_valid.js");
const song_manager_js_1 = require("../data_management/song_manager.js");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.router = router;
router.post("/meta_upload", (request, response) => {
    (0, check_authorization_valid_js_1.check_authorization_valid)(request, response, (page_session) => {
        if (request.body) {
            const upload_status = song_manager_js_1.song_manager.upload_meta_draft(request.body, page_session.authorization.login);
            response.status(200).send(upload_status);
        }
        else {
            response.status(200).send({ is_success: false, data: "Нет данных." });
        }
    });
});
router.post("/cover_upload", (request, response) => {
    (0, check_authorization_valid_js_1.check_authorization_valid)(request, response, (page_session) => {
        if (request.files) {
            const upload_status = song_manager_js_1.song_manager.upload_cover_draft(request.files.file, page_session.authorization.login);
            response.status(200).send(upload_status);
        }
        else {
            response.status(200).send({ is_success: false, data: "Нет данных." });
        }
    });
});
router.post("/song_upload", (request, response) => {
    (0, check_authorization_valid_js_1.check_authorization_valid)(request, response, (page_session) => __awaiter(void 0, void 0, void 0, function* () {
        if (request.files) {
            response.status(200);
            song_manager_js_1.song_manager.upload_song(request.files.file, page_session.authorization.login).then((status) => {
                const upload_status = status;
                console.log("UP", upload_status);
                response.send(upload_status);
            });
        }
        else {
            response.status(200).send({ is_success: false, data: "Песенку то ты добавь." });
        }
    }));
});
router.get("/get_song_meta/:song_identifier", (request, response) => {
    const song_identifier = request.params.song_identifier;
    const meta = song_manager_js_1.song_manager.song_library[song_identifier];
    if (meta) {
        response.status(200).send({ is_success: true, data: meta });
    }
    else {
        response.status(404).send({ is_success: false, data: "Композиция не найдена." });
    }
});
router.get("/get_cover_file_by_it_name/:cover_file_name", (request, response) => {
    const cover = String(request.params.cover_file_name);
    response.status(200).sendFile(path_1.default.join(__dirname, "../data_management/song_cover_library/", cover));
});
router.get("/get_song_file_by_it_name/:song_file_name", (request, response) => {
    const song = String(request.params.song_file_name);
    response.status(200).sendFile(path_1.default.join(__dirname, "../data_management/song_library/", song));
});
router.get("/dev_get_all_songs_ids", (request, response) => {
    const answer = Object.keys(song_manager_js_1.song_manager.song_library);
    response.status(200).send(answer);
});
