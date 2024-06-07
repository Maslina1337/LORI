import React, { useEffect, useState, useContext, useCallback } from "react";
import song_interface from "../scripts/song_interface";

export const SongCurrentSelectContext = React.createContext();

// Этот контекст нужен, что бы компоненты могли тригериться на изменения, но сами переменные можно брать и из song_interface.
export function SongCurrentSelectContextProvider({ children }) {
    // const [song_current_select, set_song_current_select] = useState(song_interface.current_select);

    const [identifier, set_identifier] = useState(null);
    const [meta, set_meta] = useState(null);
    const [cover, set_cover] = useState(null);
    const [song, set_song] = useState(null);
    const [is_playing, set_is_playing] = useState(false);

    return (
        <SongCurrentSelectContext.Provider value={{
        identifier, set_identifier,
        meta, set_meta,
        cover, set_cover,
        song, set_song,
        is_playing, set_is_playing}}>
            {children}
        </SongCurrentSelectContext.Provider>
    )
}