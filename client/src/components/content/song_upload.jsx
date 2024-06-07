import { useRef, useContext, useState } from "react";
import InconstancyInputForm from "../large/inconstancy_input_form";
import ButtonInconstancy from "../small/button_inconstancy";
import song_interface from "../../scripts/song_interface";
import { BackendDataContext } from "../../context/backend_data_context";
import ErrorMessage from "../small/error_message";
import "./song_upload.css"

export default function SongUpload() {
    const [error_message, set_error_message] = useState("");

    const {private_account_data, public_server_values} = useContext(BackendDataContext).get_backend_data;

    const name_ref = useRef();
    const author_ref = useRef();
    const genres_ref = useRef();
    const album_ref = useRef();
    const song_file_ref = useRef();
    const cover_file_ref = useRef();

    async function submit(event) {
        event.target.removeEventListener("click", submit);
        // Отправка запроса через интерфейс.
        const status = await song_interface.upload_song({
            name: name_ref.current.value,
            author: author_ref.current.value,
            album: album_ref.current.value,
            genres: [public_server_values.genres[Math.floor(Math.random() * public_server_values.genres.length)]],
        }, 
        song_file_ref.current, 
        cover_file_ref.current);

        if (!status.is_success) {
            set_error_message(status.data);
            event.target.addEventListener("click", submit);
        } else {
            
        }
    }

    return (
        <div className="song_upload_size_box">
            <h2 className="title">Загрузить композицию.</h2>
            <div className="form_size_box">
                <label htmlFor="song" style={{color: "black"}}>Песня</label>
                <input name="song" accept={public_server_values.valid_song_extnames.join(",")} ref={song_file_ref} type="file"/>
                <label htmlFor="cover" style={{color: "black"}}>Обложка (Необязательно)</label>
                <input name="cover" accept={public_server_values.valid_cover_extnames.join(",")} ref={cover_file_ref} type="file"/>
                <div className="meta_inputs">
                    <InconstancyInputForm required_inputs={
                        [
                            {type: "text", ref_parcel: name_ref, label: "Название", label_color: "white"},
                            {type: "text", ref_parcel: author_ref, label: "Автор", label_color: "white", placeholder: "*Необязательно"},
                            {type: "text", ref_parcel: genres_ref, label: "Жанр (Необязательно)", label_color: "white", placeholder: "*Необязательно"},
                            {type: "text", ref_parcel: album_ref, label: "Альбом (Необязательно)", label_color: "white", placeholder: "*Необязательно"},
                        ]
                    }/>
                </div>

                {(error_message !== "" ? <ErrorMessage inner_text={error_message}/> : "")}

                <ButtonInconstancy btn_inner={"Добавить"} click_fn={submit}/>
            </div>
        </div>
    )
}