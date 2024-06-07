import React, { useEffect, useState, useContext, useCallback } from "react";
import { BackendDataContext } from "./backend_data_context";

export const VolumeContext = React.createContext();

export function VolumeContextProvider({ children }) {
    const { public_server_values } = useContext(BackendDataContext).get_backend_data;
    const volume_stored = localStorage.getItem("song_volume");

    const [volume, set_volume] = useState((parseInt(volume_stored) ? parseInt(volume_stored) : public_server_values.default_song_volume));

    function set_volume_localstorage(new_volume) {
        localStorage.setItem("song_volume", new_volume);
    }

    useEffect(() => {
        localStorage.setItem("song_volume", volume);
    }, [volume]) 

    // // Проверка
    // useEffect(() => {
    //     if (volume > 100) {
    //         set_volume(100);
    //     } else if (volume < 0) {
    //         set_volume(0);
    //     }
    // }, [volume]);

    return (
        <VolumeContext.Provider value={{ volume, set_volume }}>
            {children}
        </VolumeContext.Provider>
    )
}