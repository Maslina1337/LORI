import "./playlists.css";
import { axiosInstance } from "../../context/backend_data_context";
import server_paths from "../../scripts/server_paths";
import { useEffect, useState } from "react";
import SongRow from "../small/song_row";
import MicroLoading from "../small/micro_loading";

export default function Playlists() {
    const [list, set_list] = useState(null);

    useEffect(() => {
        async function init_list() {
            const response = await axiosInstance.get(server_paths.dev_get_all_songs_ids);
            set_list(await response.data);
        }
        init_list();
    }, [])

    if (list !== null) {
        return (
            <>
                <div className="playlist_size_box">
                    {list.map((song_identifier, index) => {
                        return (<SongRow key={index} song_identifier={song_identifier}/>)
                    })}
                </div>
            </>
        )
    } else {
        return(
            <div className="playlist_size_box">
                <MicroLoading/>
            </div>
        )
    }
}