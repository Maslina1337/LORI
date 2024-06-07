import express from "express";
import { account_manager } from "../data_management/account_manager.js";
import { public_server_values } from "../data_management/public_server_values.js";
import { check_authorization_valid } from "../mechanism_exports/check_authorization_valid.js";
import { song_manager } from "../data_management/song_manager.js";
import path from "path";

const router = express.Router();

router.post("/meta_upload", (request, response) => {
    check_authorization_valid(request, response, (page_session) => {
        if (request.body) {
            const upload_status = song_manager.upload_meta_draft(request.body, page_session.authorization.login);
            response.status(200).send(upload_status);
        } else {
            response.status(200).send({is_success: false, data: "Нет данных."});
        }
    })
});

router.post("/cover_upload", (request, response) => {
    check_authorization_valid(request, response, (page_session) => {
        if (request.files) {
            const upload_status = song_manager.upload_cover_draft(request.files.file, page_session.authorization.login);
            response.status(200).send(upload_status);
        } else {
            response.status(200).send({is_success: false, data: "Нет данных."});
        }
        
    })
});

router.post("/song_upload", (request, response) => {
    check_authorization_valid(request, response, async (page_session) => {
        if (request.files) {
            response.status(200);
            song_manager.upload_song(request.files.file, page_session.authorization.login).then((status) => {
                const upload_status = status;
                console.log("UP", upload_status);
                response.send(upload_status);
            })
        } else {
            response.status(200).send({is_success: false, data: "Песенку то ты добавь."});
        }
    })
});

router.get("/get_song_meta/:song_identifier", (request, response) => {
    const song_identifier = request.params.song_identifier;
    const meta = song_manager.song_library[song_identifier];
    if (meta) {
        response.status(200).send({is_success: true, data: meta});
    } else {
        response.status(404).send({is_success: false, data: "Композиция не найдена."});
    }
})

router.get("/get_cover_file_by_it_name/:cover_file_name", (request, response) => {
    const cover = String(request.params.cover_file_name);
    response.status(200).sendFile(path.join(__dirname, "../data_management/song_cover_library/", cover));
})

router.get("/get_song_file_by_it_name/:song_file_name", (request, response) => {
    const song = String(request.params.song_file_name);
    response.status(200).sendFile(path.join(__dirname, "../data_management/song_library/", song));
})

router.get("/dev_get_all_songs_ids", (request, response) => {
    const answer = Object.keys(song_manager.song_library);
    response.status(200).send(answer);
})

export { router };