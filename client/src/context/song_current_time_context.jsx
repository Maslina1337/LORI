import React, { useEffect, useState, useContext, useCallback } from "react";
import song_interface from "../scripts/song_interface";

export const SongCurrentTimeContext = React.createContext();

// Этот контекст нужен, что бы компоненты могли тригериться на изменения, но сами переменные можно брать и из song_interface.
export function SongCurrentTimeContextProvider({ children }) {
    const [current_time, set_current_time] = useState(null);
    const [duration, set_duration] = useState(null);

    return (
        <SongCurrentTimeContext.Provider value={{current_time, set_current_time, duration, set_duration}}>
            {children}
        </SongCurrentTimeContext.Provider>
    )
}