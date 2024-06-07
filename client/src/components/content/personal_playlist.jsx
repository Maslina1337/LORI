import { useContext } from "react";
import { BackendDataContext } from "../../context/backend_data_context";

export default function PersonalPlaylist() {
    const { private_account_data, public_server_values } = useContext(BackendDataContext).get_backend_data;

    if (private_account_data.is_success) {
        
    }

    return (
        <div className="personal_playlist_size_box">
            <h2 className="title">Свалка</h2>

        </div>
    )
}