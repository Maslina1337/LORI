import React, { useEffect, useState, useContext, useCallback } from "react";

import { BackendDataContext } from "./backend_data_context";

export const LifePageContentContext = React.createContext();

export function LifePageContentContextProvider({ children }) {
    const [life_page_content, set_life_page_content] = useState(useContext(BackendDataContext).get_backend_data.public_server_values.default_life_page_content);

    return (
        <LifePageContentContext.Provider value={{ life_page_content, set_life_page_content }}>
            {children}
        </LifePageContentContext.Provider>
    )
}