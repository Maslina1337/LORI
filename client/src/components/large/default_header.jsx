import "./default_header.css";
import UserProfileCard from "../small/user_profile_card";
import LiveLogotype from "../small/live_logotype";
import CheckInconstancy from "../small/check_inconstancy";
import { BackendDataContext } from "../../context/backend_data_context";
import ButtonInconstancy from "../small/button_inconstancy";
import SongTrack from "./song_track";
import { useContext } from "react";
import { SongCurrentSelectContext } from "../../context/song_current_select_context";

export default function DefaultHeader(props) {
    const side_player_functions = props.side_player_functions;

    const { private_account_data, public_server_values } = useContext(BackendDataContext).get_backend_data;
    const clo = useContext(SongCurrentSelectContext);

    return (
        <>
            <header>
                <div className="logo_part">
                    <LiveLogotype text="LORI"/>
                </div>
                <div className="button_part">
                    {(side_player_functions ? <CheckInconstancy 
                    id="check_side_player_hiden"
                    check_unchecked_function={side_player_functions.hide}
                    check_checked_function={side_player_functions.appear}
                    check_inner_unchecked={<i className="bi bi-eye-fill"></i>}
                    check_inner_checked={<i className="bi bi-eye-slash-fill"></i>}
                    checked={(public_server_values ? public_server_values.default_side_player_display : false)}/> 
                    : "")}

                    <ButtonInconstancy btn_inner={"DEV"} click_fn={() => {
                        console.log(private_account_data, public_server_values, clo);
                    }}/>
                </div>
                <div className="track_part">
                    <SongTrack/>
                </div>
                <div className="user_profile_part">
                    <UserProfileCard/>
                </div>
            </header>
        </>
    );
}