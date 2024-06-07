const host = "localhost";
const port = "1337";
const host_port = host + ":" + port;
const request_start = "http://" + host_port;

const server_paths = {
    "request_start": request_start,
    "create_account": request_start + "/mechanism/create_account",
    "enter_account": request_start + "/mechanism/enter_account",
    "exit_account": request_start + "/mechanism/exit_account",
    "get_public_server_values": request_start + "/mechanism/get_public_server_values",
    "get_private_account_data": request_start + "/mechanism/get_private_account_data",
    "update_account_data": request_start + "/mechanism/update_account_data",
    "update_account_avatar": request_start + "/mechanism/update_account_avatar",
    "get_user_avatar": request_start + "/mechanism/get_user_avatar/",

    "meta_upload": request_start + "/song_mechanism/meta_upload",
    "cover_upload": request_start + "/song_mechanism/cover_upload",
    "song_upload": request_start + "/song_mechanism/song_upload",
    "get_song_meta": request_start + "/song_mechanism/get_song_meta/",
    "get_cover_file_by_it_name": request_start + "/song_mechanism/get_cover_file_by_it_name/",
    "get_song_file_by_it_name": request_start + "/song_mechanism/get_song_file_by_it_name/",
    "dev_get_all_songs_ids": request_start + "/song_mechanism/dev_get_all_songs_ids",
}

export default server_paths;