import "./life_page.css";
import { useContext, useEffect, useState } from "react";

// Контексты
import { LifePageContentContext } from "../context/life_page_content_context";
import { VolumeContextProvider } from "../context/volume_context";
import { SongCurrentSelectContextProvider } from "../context/song_current_select_context";
import { SongCurrentTimeContextProvider } from "../context/song_current_time_context";

// Компоненты
import SidePlayer from "../components/large/side_player";
import ContentHeader from "../components/large/content_header";
import ContentSwapper from "../components/large/content_swapper";
import AudioPlayer from "../components/large/audio_player";
import DefaultHeader from "../components/large/default_header";

import pages_paths from "../scripts/pages_paths";
import song_interface from "../scripts/song_interface";

// Страница на которой ты проводишь большую часть времени.
export default function LifePage() {
    // Создание возможности инициализации функций бокового плеера.
    const [SidePlayerFunctions, SetSidePlayerFunctions] = useState();

    const {life_page_content, set_life_page_content} = useContext(LifePageContentContext);

    return (
        <>
        <div className="screen_size_box">
            <div className="life_page_bg">
                <VolumeContextProvider>
                <SongCurrentSelectContextProvider>
                <SongCurrentTimeContextProvider>
                    <AudioPlayer/>
                    <DefaultHeader side_player_functions={SidePlayerFunctions}/>
                    <div className="wrapper">
                        <SidePlayer set_own_functions={SetSidePlayerFunctions}/>
                        <div className="right_side">
                            <div className="header_size_box">
                                <ContentHeader/>
                            </div>
                            <div className="content_size_box">
                                <ContentSwapper content_key={life_page_content}/>
                            </div>
                        </div>
                    </div>
                </SongCurrentTimeContextProvider>
                </SongCurrentSelectContextProvider>
                </VolumeContextProvider>
            </div>
        </div>
        </>
    )
}